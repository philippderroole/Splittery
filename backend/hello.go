package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Activity struct {
	gorm.Model
	Name     string    `json:"name"`
	Expenses []Expense `json:"expenses" gorm:"foreignKey:ActivityID;not null;"`
}

type Expense struct {
	gorm.Model
	ActivityID uint      `json:"activity_id"`
	Name       string    `json:"name"`
	Amount     uint      `json:"amount"`
	UserID     uint      `json:"user_id"`
	Balances   []Balance `json:"balances" gorm:"foreignKey:ExpenseID;"` // One-To-Many relationship (has many)
}

type Balance struct {
	gorm.Model
	ExpenseID  uint `json:"expense_id"`
	Amount     uint `json:"amount"`
	User       User `json:"user" gorm:"foreignKey:ID;"`
	Share      uint `json:"share"`
	isSelected bool `json:"is_selected"`
}

type User struct {
	gorm.Model
	Name     string    `json:"name"`
	Expenses []Expense `json:"expences" gorm:"foreignKey:UserID;"` // One-To-Many relationship (has many)
}

func main() {
	dsn := "host=127.0.0.1 user=postgres password=1234 dbname=splittery port=5432 sslmode=disable TimeZone=Europe/Berlin"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&Activity{}, &Balance{}, &Expense{}, &User{})

	router := gin.Default()
	router.GET("/activity/getAll", getActivities)
	router.POST("/activity/create", createActivity)

	router.Run("localhost:8000")
}

var activities = []Activity{
	{Name: "The Grey Album", Expenses: []Expense{}},
}

func getActivities(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, activities)
}

func createActivity(c *gin.Context) {
	var newActivity Activity

	// Call BindJSON to bind the received JSON to newActivity
	if err := c.BindJSON(&newActivity); err != nil {
		return
	}

	// Add the new activity to the slice.
	activities = append(activities, newActivity)
	c.IndentedJSON(http.StatusCreated, newActivity)
}
