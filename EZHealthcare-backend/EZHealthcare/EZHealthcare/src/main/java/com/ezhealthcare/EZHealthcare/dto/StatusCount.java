package com.ezhealthcare.EZHealthcare.dto;

import com.ezhealthcare.EZHealthcare.model.AppointmentStatus;

public interface StatusCount {
    AppointmentStatus getStatus();
    Long getCount();
}
