package com.ezhealthcare.EZHealthcare.repository;

import com.ezhealthcare.EZHealthcare.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndIsReadFalse(Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId AND n.isRead = false")
    void markAllAsRead(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.appointment.id = :appointmentId AND n.status = :status")
    List<Notification> findByUserIdAndAppointmentIdAndStatus(
            @Param("userId") Long userId,
            @Param("appointmentId") Long appointmentId,
            @Param("status") String status
    );

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.appointment.id = :appointmentId")
    void deleteByAppointmentId(Long appointmentId);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user.id = :userId")
    void deleteByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.appointment.id = :appointmentId")
    void deleteNotificationsByAppointmentId(@Param("appointmentId") Long appointmentId);
}
