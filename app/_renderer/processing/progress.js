import { ipcRenderer } from 'electron';

const parseSeconds = (seconds) => [Math.floor(seconds / 60), Math.round(seconds % 60, 1)];
const fmtMSS = (seconds) => {
  const parsed = parseSeconds(seconds);
  return `${parsed[0]}m ${parsed[1]}s`;
};

export default class Progress {
  constructor(length, name, current = 0, spacing = 0.01) {
    this.length = length;
    this.current = current;
    this.spacing = spacing;
    this.currentProgress = this.getProgress();
    this.name = name;
    this.average = 0;
    this.startTime = new Date();
    this.increments = 0;
    if (!this.length) {
      ipcRenderer.send('SET_PROGRESS', {
        progress: -1,
        message: `Processing: ${this.name}`,
        name: this.name,
        remaining: 'This may take a while'
      });
    }
  }

  getProgress = () => Math.floor((this.current / this.length) / this.spacing) * this.spacing


  indeterminate(message) {
    this.current = -1;
    ipcRenderer.send('SET_PROGRESS', {
      progress: -1,
      message: message || `Processing: ${this.name}`,
      name: this.name
    });
  }

  increment(i = 1, message) {
    this.current += i;
    const progress = this.getProgress();
    if (this.getProgress() > this.currentProgress) {
      this.increments += 1;
      const remainingIncrements = (1 - progress) / this.spacing;
      const averageTimePerIncrement = (new Date() - this.startTime) / this.increments;
      const remaining = fmtMSS((averageTimePerIncrement * remainingIncrements) / 1000);
      this.currentProgress = progress;
      ipcRenderer.send('SET_PROGRESS', {
        progress: Math.min(progress, 1),
        message: message || `Processing: ${this.name}`,
        name: this.name,
        remaining
      });
    }
  }

  error(level, message) {
    ipcRenderer.send('SET_ERROR', {
      message: message || `Error: ${this.name}`,
      level,
      name
    });
  }

  complete() {
    const taken = fmtMSS((new Date() - this.startTime) / 1000);
    ipcRenderer.send('SET_COMPLETE', {
      name: this.name,
      taken
    });
  }
}
