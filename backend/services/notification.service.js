const User = require("../model/user.model");
const Captain = require("../model/captain.model");
const { AppError } = require("../utils/appError");

class NotificationService {
  /**
   * Notify a user about a ride event
   * @param {Object} user - User document
   * @param {Object} notification - Notification data
   */
  static async notifyUser(user, notification) {
    try {
      // Add notification to user's notifications array
      await User.findByIdAndUpdate(user._id, {
        $push: {
          notifications: {
            type: notification.type,
            message: this.getUserNotificationMessage(notification),
            data: notification,
            createdAt: new Date(),
            read: false,
          },
        },
      });

      // TODO: Implement real-time notification (e.g., WebSocket, Push Notification)
      console.log(`Notification sent to user ${user._id}:`, notification);
    } catch (error) {
      console.error("Error sending user notification:", error);
      throw new AppError("Failed to send user notification", 500);
    }
  }

  /**
   * Notify a captain about a ride event
   * @param {Object} captain - Captain document
   * @param {Object} notification - Notification data
   */
  static async notifyCaptain(captain, notification) {
    try {
      // Add notification to captain's notifications array
      await Captain.findByIdAndUpdate(captain._id, {
        $push: {
          notifications: {
            type: notification.type,
            message: this.getCaptainNotificationMessage(notification),
            data: notification,
            createdAt: new Date(),
            read: false,
          },
        },
      });

      // TODO: Implement real-time notification (e.g., WebSocket, Push Notification)
      console.log(`Notification sent to captain ${captain._id}:`, notification);
    } catch (error) {
      console.error("Error sending captain notification:", error);
      throw new AppError("Failed to send captain notification", 500);
    }
  }

  /**
   * Notify multiple captains about a new ride request
   * @param {Array} captains - Array of captain documents
   * @param {Object} notification - Notification data
   */
  static async notifyCaptains(captains, notification) {
    try {
      const captainIds = captains.map((captain) => captain._id);

      // Add notification to all captains' notifications array
      await Captain.updateMany(
        { _id: { $in: captainIds } },
        {
          $push: {
            notifications: {
              type: notification.type,
              message: this.getCaptainNotificationMessage(notification),
              data: notification,
              createdAt: new Date(),
              read: false,
            },
          },
        }
      );

      // TODO: Implement real-time notification (e.g., WebSocket, Push Notification)
      console.log(
        `Notification sent to ${captainIds.length} captains:`,
        notification
      );
    } catch (error) {
      console.error("Error sending notifications to captains:", error);
      throw new AppError("Failed to send notifications to captains", 500);
    }
  }

  /**
   * Get notification message for user based on notification type
   * @param {Object} notification - Notification data
   * @returns {string} Notification message
   */
  static getUserNotificationMessage(notification) {
    switch (notification.type) {
      case "RIDE_CONFIRMED":
        return `Your ride has been confirmed! Captain ${notification.captain.name} is on the way.`;
      case "RIDE_STARTED":
        return "Your ride has started! Enjoy your trip.";
      case "RIDE_COMPLETED":
        return `Your ride has been completed. Fare: ₹${notification.fare}`;
      case "RIDE_CANCELLED":
        return `Your ride has been cancelled. Reason: ${notification.reason}`;
      case "CAPTAIN_LOCATION_UPDATE":
        return "Captain location has been updated.";
      default:
        return "You have a new notification.";
    }
  }

  /**
   * Get notification message for captain based on notification type
   * @param {Object} notification - Notification data
   * @returns {string} Notification message
   */
  static getCaptainNotificationMessage(notification) {
    switch (notification.type) {
      case "NEW_RIDE_REQUEST":
        return `New ride request! Pickup: ${notification.pickup.address}, Fare: ₹${notification.fare}`;
      case "RIDE_CANCELLED":
        return `Ride cancelled. Reason: ${notification.reason}`;
      default:
        return "You have a new notification.";
    }
  }

  /**
   * Mark a notification as read for a user
   * @param {string} userId - User ID
   * @param {string} notificationId - Notification ID
   */
  static async markUserNotificationAsRead(userId, notificationId) {
    try {
      await User.updateOne(
        { _id: userId, "notifications._id": notificationId },
        { $set: { "notifications.$.read": true } }
      );
    } catch (error) {
      console.error("Error marking user notification as read:", error);
      throw new AppError("Failed to mark notification as read", 500);
    }
  }

  /**
   * Mark a notification as read for a captain
   * @param {string} captainId - Captain ID
   * @param {string} notificationId - Notification ID
   */
  static async markCaptainNotificationAsRead(captainId, notificationId) {
    try {
      await Captain.updateOne(
        { _id: captainId, "notifications._id": notificationId },
        { $set: { "notifications.$.read": true } }
      );
    } catch (error) {
      console.error("Error marking captain notification as read:", error);
      throw new AppError("Failed to mark notification as read", 500);
    }
  }

  /**
   * Get unread notifications for a user
   * @param {string} userId - User ID
   * @returns {Array} Array of unread notifications
   */
  static async getUserUnreadNotifications(userId) {
    try {
      const user = await User.findById(userId);
      return user.notifications.filter((notification) => !notification.read);
    } catch (error) {
      console.error("Error getting user unread notifications:", error);
      throw new AppError("Failed to get unread notifications", 500);
    }
  }

  /**
   * Get unread notifications for a captain
   * @param {string} captainId - Captain ID
   * @returns {Array} Array of unread notifications
   */
  static async getCaptainUnreadNotifications(captainId) {
    try {
      const captain = await Captain.findById(captainId);
      return captain.notifications.filter((notification) => !notification.read);
    } catch (error) {
      console.error("Error getting captain unread notifications:", error);
      throw new AppError("Failed to get unread notifications", 500);
    }
  }
}

module.exports = NotificationService;
