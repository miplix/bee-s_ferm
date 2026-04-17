/**
 * FIXED RULE: All objects on the map are 2x2 cells.
 * This includes: trees, buildings (Market, Workbench, Campfire, Kitchen, etc.)
 * Only crop plots remain 1x1.
 *
 * DO NOT CHANGE without explicit user request.
 * Reference: rules/FIXED_VARIABLES.md
 */

export const OBJECT_SIZE = 2; // All objects are 2x2
export const PLOT_SIZE = 1;   // Plots remain 1x1
