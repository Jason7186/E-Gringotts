package com.egringotts.egringotts.config;


import com.egringotts.egringotts.exception.AccessDeniedException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class JwtHelper {

    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final int EXPIRATION_TIME = 30; // Expiration time in minutes

    public static String generateToken(String email) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(EXPIRATION_TIME, ChronoUnit.MINUTES)))
                .signWith(SECRET_KEY)
                .compact();
    }

    public static String extractUsername(String token) {
        return parseToken(token).getBody().getSubject();
    }

    public static boolean validateToken(String token, UserDetails userDetails) {
        try {
            Claims claims = parseToken(token).getBody();
            return claims.getSubject().equals(userDetails.getUsername()) && !claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException ex) {
            throw new AccessDeniedException("Token expired: " + ex.getMessage());
        } catch (Exception ex) {
            throw new AccessDeniedException("Invalid token: " + ex.getMessage());
        }
    }

    private static Jws<Claims> parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token);
    }

    private static boolean isTokenExpired(String token) {
        Date expiration = parseToken(token).getBody().getExpiration();
        return expiration.before(new Date());
    }
}
