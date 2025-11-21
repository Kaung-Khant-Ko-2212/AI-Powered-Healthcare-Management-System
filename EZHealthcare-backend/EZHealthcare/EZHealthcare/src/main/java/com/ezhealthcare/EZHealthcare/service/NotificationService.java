package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.model.Appointment;
import com.ezhealthcare.EZHealthcare.model.Notification;
import com.ezhealthcare.EZHealthcare.model.User;
import com.ezhealthcare.EZHealthcare.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    public void createNotification(User user, Appointment appointment, String status, String message) {
        // Check if notification already exists for this appointment and status
        List<Notification> existingNotifications = notificationRepository
                .findByUserIdAndAppointmentIdAndStatus(user.getId(), appointment.getId(), status);

        // If no duplicate exists, create a new notification
        if (existingNotifications.isEmpty()) {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setAppointment(appointment);
            notification.setStatus(status);
            notification.setTitle(message); // Use the provided message as the title
            notification.setIsRead(false);

            System.out.println("Creating notification for user: " + user.getId()); // Debugging
            notificationRepository.save(notification);
        }
    }
    @Transactional
    public void deleteNotificationsByAppointmentId(Long appointmentId) {
        notificationRepository.deleteByAppointmentId(appointmentId);
    }
}
