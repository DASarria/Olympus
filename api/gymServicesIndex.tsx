/**
 * This module acts as an index that centralizes the exports from various gym-related services.
 * It re-exports functions and types from the following services:
 * 
 * - **Exercise Service**: Functions related to exercises, including creation, retrieval, and updates.
 * - **Goal Service**: Functions for managing user fitness goals.
 * - **Reservation Service**: Functions for managing gym reservations, availability, and waitlists.
 * - **Session Management Service**: Functions related to gym sessions, including creation, updates, and cancellations.
 * - **Physical Progress Service**: Functions for recording and retrieving physical progress and measurements.
 * - **Reports and Analysis Service**: Functions to generate various reports such as user progress and gym usage.
 * - **Routines Service**: Functions for managing workout routines and user progress.
 * - **Slots and Schedule Management Service**: Functions for managing student attendance and session schedules.
 * - **User Service**: Functions related to user management, including creation, updates, and deletions.
 * 
 * This file simplifies imports by aggregating all these exports in one location.
 * 
 * @module gym-services-index
 */

export * from './gym-module/excerciseService';
export * from './gym-module/goalService';
export * from './gym-module/gymReservationService';
export * from './gym-module/gymSessionManagementService';
export * from './gym-module/physicalProgressService';
export * from './gym-module/reportsAndAnalysisService';
export * from './gym-module/routinesService';
export * from './gym-module/slotsAndScheduleManagementService';
export * from './gym-module/userService';