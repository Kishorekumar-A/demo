let registeredUser = null;
let emailVerified = false;


// -----------------------------
// SHOW LOGIN
// -----------------------------

function showLogin() {

    document.getElementById("loginBox").classList.remove("hidden");

    document.getElementById("signupBox").classList.add("hidden");

    document.getElementById("verificationBox").classList.add("hidden");

    document.getElementById("dashboardBox").classList.add("hidden");
}


// -----------------------------
// SHOW SIGN UP
// -----------------------------

function showSignup() {

    document.getElementById("loginBox").classList.add("hidden");

    document.getElementById("signupBox").classList.remove("hidden");

    document.getElementById("verificationBox").classList.add("hidden");

    document.getElementById("dashboardBox").classList.add("hidden");
}


// -----------------------------
// SIGN UP
// -----------------------------

document.getElementById("signupForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const employeeId =
            document.getElementById("employeeId").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const role =
            document.getElementById("role").value;

        const error =
            document.getElementById("signupError");


        // Password validation

        const passwordPattern =
            /^(?=.*[A-Z])(?=.*\d).{8,}$/;


        if (!passwordPattern.test(password)) {

            error.textContent =
                "Password must have 8 characters, one uppercase letter and one number.";

            return;
        }


        if (role === "") {

            error.textContent =
                "Please select a role.";

            return;
        }


        // Save user temporarily

        registeredUser = {

            employeeId: employeeId,

            email: email,

            password: password,

            role: role

        };


        emailVerified = false;


        error.textContent = "";


        // Show verification screen

        document.getElementById("signupBox")
            .classList.add("hidden");

        document.getElementById("verificationBox")
            .classList.remove("hidden");

        document.getElementById("verificationEmail")
            .textContent = email;
    }
);


// -----------------------------
// EMAIL VERIFICATION
// -----------------------------

function verifyEmail() {

    emailVerified = true;

    alert("Email verified successfully!");

    showLogin();
}


// -----------------------------
// LOGIN
// -----------------------------

document.getElementById("loginForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const error =
            document.getElementById("loginError");


        // Check if user exists

        if (registeredUser === null) {

            error.textContent =
                "No account found. Please sign up first.";

            return;
        }


        // Check email verification

        if (!emailVerified) {

            error.textContent =
                "Please verify your email before signing in.";

            return;
        }


        // Check credentials

        if (
            email !== registeredUser.email ||
            password !== registeredUser.password
        ) {

            error.textContent =
                "Incorrect email or password.";

            return;
        }


        error.textContent = "";


        // Successful login

        showDashboard();

    }
);


// -----------------------------
// DASHBOARD
// -----------------------------

function showDashboard() {

    document.getElementById("loginBox")
        .classList.add("hidden");

    document.getElementById("signupBox")
        .classList.add("hidden");

    document.getElementById("verificationBox")
        .classList.add("hidden");

    document.getElementById("dashboardBox")
        .classList.remove("hidden");


    document.getElementById("dashboardTitle")
        .textContent =
        registeredUser.role + " Dashboard";


    document.getElementById("dashboardMessage")
        .textContent =
        "Welcome to Dayflow, " +
        registeredUser.employeeId + "!";


    document.getElementById("userDetails")
        .textContent =
        "Email: " +
        registeredUser.email +
        " | Role: " +
        registeredUser.role;
}


// -----------------------------
// LOGOUT
// -----------------------------

function logout() {

    showLogin();

    document.getElementById("loginForm").reset();

    document.getElementById("loginError")
        .textContent = "";
}