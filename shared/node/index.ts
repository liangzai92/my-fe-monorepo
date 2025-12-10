import os from 'os';

/**
 * Get basic system information
 * Note: This module is intended for Node.js environments only
 */
export function getSystemInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    hostname: os.hostname(),
  };
}
