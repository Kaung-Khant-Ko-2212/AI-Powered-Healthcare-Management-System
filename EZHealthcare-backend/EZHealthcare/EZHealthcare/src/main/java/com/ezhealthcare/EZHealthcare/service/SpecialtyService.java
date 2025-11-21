package com.ezhealthcare.EZHealthcare.service;


import com.ezhealthcare.EZHealthcare.model.Specialty;
import com.ezhealthcare.EZHealthcare.repository.SpecialtyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecialtyService {
    @Autowired
    private SpecialtyRepository specialtyRepository;

    public List<Specialty> getAllSpecialties() {
        return specialtyRepository.findAll();
    }

}
