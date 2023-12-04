package com.example.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.dto.UserInfo;


public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    boolean existsByUserId(String userId);
    // boolean existsByNickname(String nickname);
    // Optional<User> findByLoginId(String loginId);

    // Member findByName(String name);
    // List<Member> findByAgeGreaterThanEqualAndAgeLessThanEqual(int minAge, int maxAge);
    // List<Member> findAllByIsMale(Boolean isMale);
    
}
