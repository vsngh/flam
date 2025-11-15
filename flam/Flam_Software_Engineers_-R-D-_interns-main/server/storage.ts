/**
 * Storage interface - not used in this computer vision demo
 * Kept for potential future extensions
 */

export interface IStorage {
  // Placeholder for future storage needs
}

export class MemStorage implements IStorage {
  constructor() {
    // No storage needed for this demo
  }
}

export const storage = new MemStorage();
