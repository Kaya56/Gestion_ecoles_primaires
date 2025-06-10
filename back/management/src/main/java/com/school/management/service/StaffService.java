// service/StaffService.java
package com.school.management.service;

import com.school.management.entity.Staff;
import com.school.management.entity.enums.UserRole;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffService {

    private final StaffRepository staffRepository;

    public Staff createStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    public Staff updateStaff(Long id, Staff staffUpdate) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel non trouvé"));

        staff.setFirstName(staffUpdate.getFirstName());
        staff.setLastName(staffUpdate.getLastName());
        staff.setEmail(staffUpdate.getEmail());
        staff.setPhone(staffUpdate.getPhone());
        staff.setAddress(staffUpdate.getAddress());
        staff.setRole(staffUpdate.getRole());
        staff.setHireDate(staffUpdate.getHireDate());
        staff.setSalary(staffUpdate.getSalary());
        staff.setDepartment(staffUpdate.getDepartment());
        staff.setPosition(staffUpdate.getPosition());
        staff.setGender(staffUpdate.getGender());
        staff.setBirthDate(staffUpdate.getBirthDate());

        return staffRepository.save(staff);
    }

    @Transactional(readOnly = true)
    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel non trouvé"));
    }

    @Transactional(readOnly = true)
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Staff> getStaffBySearch(String search, Pageable pageable) {
        return staffRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                search, search, pageable);
    }

    @Transactional(readOnly = true)
    public List<Staff> getStaffByRole(UserRole role) {
        return staffRepository.findByRole(role);
    }

    @Transactional(readOnly = true)
    public List<Staff> getStaffByDepartment(String department) {
        return staffRepository.findByDepartment(department);
    }

    @Transactional(readOnly = true)
    public List<Staff> getStaffByPosition(String position) {
        return staffRepository.findByPosition(position);
    }

    @Transactional(readOnly = true)
    public Staff getStaffByEmail(String email) {
        return staffRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel non trouvé avec cet email"));
    }

    public void deleteStaff(Long id) {
        if (!staffRepository.existsById(id)) {
            throw new ResourceNotFoundException("Personnel non trouvé");
        }
        staffRepository.deleteById(id);
    }
}