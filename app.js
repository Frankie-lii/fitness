// ========== HEADER NAVIGATION ==========

// Toggle the mobile menu open/close
function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("active");
}

// Close the menu when clicking outside
document.addEventListener("click", function(event) {
    let menu = document.getElementById("navMenu");
    let menuIcon = document.querySelector(".menu-icon");

    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.classList.remove("active");
    }
});

// ========== SECTION SWITCHING ==========

// Function to switch between sections smoothly
function showSection(sectionId) {
    let sections = document.querySelectorAll(".section");
    sections.forEach(section => section.style.display = "none"); // Hide all sections

    document.getElementById(sectionId).style.display = "block"; // Show selected section

    // Close mobile menu after clicking a link (for mobile users)
    document.getElementById("navMenu").classList.remove("active");
}

// Load home section by default when the page loads
document.addEventListener("DOMContentLoaded", function() {
    showSection("home");
    updateDashboard();
    loadChart();
    loadMeals();
    loadWorkouts();
    loadProfile();
});

// ========== DASHBOARD FUNCTIONALITY ==========

// Function to update user fitness stats dynamically
function updateDashboard() {
    let userData = JSON.parse(localStorage.getItem("loggedInUser")) || {
        name: "Guest",
        profilePic: "assets/default-avatar.png",
        steps: "10,000",
        calories: "500 kcal",
        heartRate: "72 BPM",
        workouts: "5"
    };

    document.getElementById("username").textContent = userData.name;
    document.getElementById("profile-pic").src = userData.profilePic;
    document.getElementById("steps").textContent = userData.steps;
    document.getElementById("calories").textContent = userData.calories;
    document.getElementById("heart-rate").textContent = userData.heartRate;
    document.getElementById("workouts").textContent = userData.workouts;
}

// ========== CHART.JS (DASHBOARD GRAPH) ==========

function loadChart() {
    let ctx = document.getElementById("progressChart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Calories Burned",
                data: [400, 450, 500, 550, 600, 620, 700],
                borderColor: "#FF6600",
                backgroundColor: "rgba(255, 102, 0, 0.2)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ========== WORKOUT FUNCTIONALITY ==========

let workoutList = JSON.parse(localStorage.getItem("workoutList")) || [];

function logWorkout() {
    let exerciseName = document.getElementById("exercise-name").value;
    let duration = parseInt(document.getElementById("duration").value);
    let intensity = document.getElementById("intensity").value;

    if (!exerciseName || isNaN(duration) || duration <= 0) {
        alert("Please enter valid workout details.");
        return;
    }

    workoutList.push({ name: exerciseName, duration: duration, intensity: intensity });

    updateWorkoutHistory();
    localStorage.setItem("workoutList", JSON.stringify(workoutList));
}

function updateWorkoutHistory() {
    let workoutListElement = document.getElementById("workout-list");
    workoutListElement.innerHTML = "";

    workoutList.forEach(workout => {
        let li = document.createElement("li");
        li.textContent = `${workout.name} - ${workout.duration} min (${workout.intensity} intensity)`;
        workoutListElement.appendChild(li);
    });
}

function loadWorkouts() {
    if (workoutList.length > 0) {
        updateWorkoutHistory();
    }
}

// ========== NUTRITION FUNCTIONALITY ==========

let mealList = JSON.parse(localStorage.getItem("mealList")) || [];
let totalCalories = parseInt(localStorage.getItem("totalCalories")) || 0;

function logMeal() {
    let mealType = document.getElementById("meal-type").value;
    let mealName = document.getElementById("meal-name").value;
    let calories = parseInt(document.getElementById("calories").value);

    if (!mealName || isNaN(calories) || calories <= 0) {
        alert("Please enter valid meal details.");
        return;
    }

    mealList.push({ type: mealType, name: mealName, calories: calories });
    totalCalories += calories;

    updateNutritionSummary();
    localStorage.setItem("mealList", JSON.stringify(mealList));
    localStorage.setItem("totalCalories", totalCalories);
}

function updateNutritionSummary() {
    document.getElementById("total-calories").textContent = totalCalories;
    let mealListElement = document.getElementById("meal-list");
    mealListElement.innerHTML = "";

    mealList.forEach(meal => {
        let li = document.createElement("li");
        li.textContent = `${meal.type.toUpperCase()}: ${meal.name} - ${meal.calories} kcal`;
        mealListElement.appendChild(li);
    });
}

function loadMeals() {
    if (mealList.length > 0) {
        updateNutritionSummary();
    }
}

// ========== CONTACT FORM FUNCTIONALITY ==========

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("contact-name").value;
    let email = document.getElementById("contact-email").value;
    let message = document.getElementById("contact-message").value;

    if (!name || !email || !message) {
        alert("Please fill out all fields.");
        return;
    }

    alert(`Thank you, ${name}! Your message has been sent.`);
    document.getElementById("contactForm").reset();
});

// ========== USER AUTHENTICATION ==========

let users = JSON.parse(localStorage.getItem("users")) || [];

document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("signup-name").value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;

    if (!name || !email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    let existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert("Email is already registered!");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! You can now log in.");
    showSection('login');
});

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;
    let user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert(`Welcome back, ${user.name}!`);
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        showSection('dashboard');
    } else {
        alert("Invalid email or password!");
    }
});

function logout() {
    localStorage.removeItem("loggedInUser");
    alert("You have been logged out.");
    showSection('login');
}