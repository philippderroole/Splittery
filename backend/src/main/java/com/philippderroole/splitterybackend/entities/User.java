package com.philippderroole.splitterybackend.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(name = "splittery_user")
public class User implements UserDetails, CredentialsContainer {
    @Id
    @UuidGenerator
    private String id;

    private String name;

    private String password;

    private String email;

    private boolean anonymous = false;

    private boolean enabled = true;

    @Column
    private Date lastLogout = new GregorianCalendar(0, Calendar.JANUARY, 1).getTime();

    @ManyToMany
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "owner")
    private Collection<Split> ownedSplits = new ArrayList<>();

    public User() {
    }

    public User(String name) {
        this.name = name;
    }

    @Override
    public void eraseCredentials() {
        this.password = null;
    }

    public Date getLastLogout() {
        return lastLogout;
    }

    public void setLastLogout(Date lastLogout) {
        this.lastLogout = lastLogout;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isAnonymous() {
        return anonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.anonymous = anonymous;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String getUsername() {
        return "";
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Collection<Split> getOwnedSplits() {
        return ownedSplits;
    }

    public void setOwnedSplits(Collection<Split> ownedPolls) {
        this.ownedSplits = ownedPolls;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isDisabled() {
        return !enabled;
    }
}
