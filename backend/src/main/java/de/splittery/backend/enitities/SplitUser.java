package de.splittery.backend.enitities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import org.javamoney.moneta.Money;

@Entity
public class SplitUser {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private Money share;

    @ManyToOne
    private Split split;

    @ManyToOne
    private GlobalUser globalUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Split getSplit() {
        return split;
    }

    public void setSplit(Split split) {
        this.split = split;
    }
}
