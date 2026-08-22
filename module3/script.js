/* =====================================================
   DAYFLOW - AUTHENTICATION + DASHBOARD
   ===================================================== */


/* =====================================================
   DATA STORAGE
   ===================================================== */

function getUsers() {

    return JSON.parse(
        localStorage.getItem("dayflowUsers")
    ) || [];

}


function saveUsers(users) {

    localStorage.setItem(
        "dayflowUsers",
        JSON.stringify(users)
    );

}


function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("dayflowCurrentUser")
    );

}


function saveCurrentUser(user) {

    localStorage.setItem(
        "dayflowCurrentUser",
        JSON.stringify(user)
    );

}


function clearCurrentUser() {

    localStorage.removeItem(
        "dayflowCurrentUser"
    );

}


/* =====================================================
   AUTHENTICATION SCREEN
   ===================================================== */

function showLogin() {

    document
        .getElementById("loginBox")
        .classList.remove("hidden");

    document
        .getElementById("signupBox")
        .classList.add("hidden");

    document
        .getElementById("verificationBox")
        .classList.add("hidden");


    document
        .getElementById("loginError")
        .textContent = "";

}


function showSignup() {

    document
        .getElementById("loginBox")
        .classList.add("hidden");

    document
        .getElementById("signupBox")
        .classList.remove("hidden");

    document
        .getElementById("verificationBox")
        .classList.add("hidden");


    document
        .getElementById("signupError")
        .textContent = "";

}


/* =====================================================
   SIGN UP
   ===================================================== */

document
    .getElementById("signupForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const employeeId =
                document
                    .getElementById("employeeId")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("signupEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("signupPassword")
                    .value;


            const role =
                document
                    .getElementById("role")
                    .value;


            const error =
                document
                    .getElementById("signupError");


            /* -----------------------------------------
               BASIC VALIDATION
               ----------------------------------------- */

            if (
                employeeId === "" ||
                email === "" ||
                password === "" ||
                role === ""
            ) {

                error.textContent =
                    "Please fill in all fields.";

                return;

            }


            /* -----------------------------------------
               PASSWORD SECURITY
               ----------------------------------------- */

            const passwordPattern =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


            if (!passwordPattern.test(password)) {

                error.textContent =
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number.";

                return;

            }


            /* -----------------------------------------
               CHECK EXISTING USERS
               ----------------------------------------- */

            const users = getUsers();


            const emailExists =
                users.some(
                    user => user.email === email
                );


            if (emailExists) {

                error.textContent =
                    "An account with this email already exists.";

                return;

            }


            const idExists =
                users.some(
                    user =>
                        user.employeeId.toLowerCase() ===
                        employeeId.toLowerCase()
                );


            if (idExists) {

                error.textContent =
                    "This Employee ID is already registered.";

                return;

            }


            /* -----------------------------------------
               CREATE USER
               ----------------------------------------- */

            const newUser = {

                employeeId: employeeId,

                email: email,

                password: password,

                role: role,

                verified: false,

                attendance: [],

                leaveRequests: [],

                activity: [],

                alerts: []

            };


            users.push(newUser);

            saveUsers(users);


            /* -----------------------------------------
               SHOW VERIFICATION
               ----------------------------------------- */

            document
                .getElementById("signupBox")
                .classList.add("hidden");


            document
                .getElementById("verificationBox")
                .classList.remove("hidden");


            document
                .getElementById("verificationEmail")
                .textContent = email;

        }
    );


/* =====================================================
   EMAIL VERIFICATION
   ===================================================== */

function verifyEmail() {

    const email =
        document
            .getElementById("verificationEmail")
            .textContent;


    const users = getUsers();


    const userIndex =
        users.findIndex(
            user => user.email === email
        );


    if (userIndex === -1) {

        alert("User account not found.");

        return;

    }


    users[userIndex].verified = true;

    saveUsers(users);


    alert(
        "Email verified successfully. You can now sign in."
    );


    document
        .getElementById("loginEmail")
        .value = email;


    showLogin();

}


/* =====================================================
   SIGN IN
   ===================================================== */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const error =
                document
                    .getElementById("loginError");


            const users = getUsers();


            /* -----------------------------------------
               FIND USER
               ----------------------------------------- */

            const user =
                users.find(
                    account =>
                        account.email === email
                );


            if (!user) {

                error.textContent =
                    "No account found with this email.";

                return;

            }


            /* -----------------------------------------
               CHECK VERIFICATION
               ----------------------------------------- */

            if (!user.verified) {

                error.textContent =
                    "Please verify your email before signing in.";

                return;

            }


            /* -----------------------------------------
               CHECK PASSWORD
               ----------------------------------------- */

            if (user.password !== password) {

                error.textContent =
                    "Incorrect password.";

                return;

            }


            /* -----------------------------------------
               LOGIN SUCCESS
               ----------------------------------------- */

            saveCurrentUser(user);


            openDashboard();

        }
    );


/* =====================================================
   OPEN DASHBOARD
   ===================================================== */

function openDashboard() {

    const user = getCurrentUser();


    if (!user) {

        return;

    }


    /* Hide authentication */

    document
        .getElementById("authSection")
        .classList.add("hidden");


    /* Show dashboard */

    document
        .getElementById("dashboardSection")
        .classList.remove("hidden");


    /* User information */

    document
        .getElementById("loggedUser")
        .textContent =
        user.employeeId;


    document
        .getElementById("userRole")
        .textContent =
        user.role;


    document
        .getElementById("userAvatar")
        .textContent =
        user.employeeId
            .substring(0, 2)
            .toUpperCase();


    /* -----------------------------------------
       ROLE BASED ACCESS
       ----------------------------------------- */

    if (user.role === "Employee") {

        setupEmployeeDashboard();

    }
    else if (user.role === "HR") {

        setupHRDashboard();

    }

}


/* =====================================================
   EMPLOYEE DASHBOARD
   ===================================================== */

function setupEmployeeDashboard() {

    document
        .querySelectorAll(".employee-only")
        .forEach(
            element =>
                element.classList.remove("hidden")
        );


    document
        .querySelectorAll(".hr-only")
        .forEach(
            element =>
                element.classList.add("hidden")
        );


    showDashboard();

}


function showDashboard() {

    const user = getCurrentUser();


    hideAllPages();


    if (user.role === "Employee") {

        document
            .getElementById("employeeDashboard")
            .classList.remove("hidden");


        document
            .getElementById("dashboardTitle")
            .textContent =
            "Employee Dashboard";


        document
            .getElementById("welcomeText")
            .textContent =
            "Welcome back! Here's your workday overview.";

    }


    else if (user.role === "HR") {

        document
            .getElementById("hrDashboard")
            .classList.remove("hidden");


        document
            .getElementById("dashboardTitle")
            .textContent =
            "HR / Admin Dashboard";


        document
            .getElementById("welcomeText")
            .textContent =
            "Manage employees, attendance and leave approvals.";


        updateHRDashboard();

    }

}


/* =====================================================
   HR DASHBOARD
   ===================================================== */

function setupHRDashboard() {

    document
        .querySelectorAll(".employee-only")
        .forEach(
            element =>
                element.classList.add("hidden")
        );


    document
        .querySelectorAll(".hr-only")
        .forEach(
            element =>
                element.classList.remove("hidden")
        );


    showDashboard();

}


/* =====================================================
   UPDATE HR DASHBOARD
   ===================================================== */

function updateHRDashboard() {

    const users = getUsers();


    /* -----------------------------------------
       TOTAL EMPLOYEES
       ----------------------------------------- */

    const employees =
        users.filter(
            user => user.role === "Employee"
        );


    document
        .getElementById("totalEmployees")
        .textContent =
        employees.length;


    /* -----------------------------------------
       ATTENDANCE COUNTS
       ----------------------------------------- */

    let present = 0;

    let absent = 0;


    employees.forEach(
        employee => {

            if (!employee.attendance) {

                return;

            }


            employee.attendance.forEach(
                record => {

                    if (record.status === "Present") {

                        present++;

                    }

                    if (record.status === "Absent") {

                        absent++;

                    }

                }
            );

        }
    );


    document
        .getElementById("presentCount")
        .textContent =
        present;


    document
        .getElementById("absentCount")
        .textContent =
        absent;


    /* -----------------------------------------
       PENDING LEAVES
       ----------------------------------------- */

    let pendingLeaves = 0;


    employees.forEach(
        employee => {

            if (!employee.leaveRequests) {

                return;

            }


            pendingLeaves +=
                employee.leaveRequests.filter(
                    request =>
                        request.status === "Pending"
                ).length;

        }
    );


    document
        .getElementById("pendingLeaveCount")
        .textContent =
        pendingLeaves;


    renderEmployeeList();

    renderAttendanceRecords();

    renderLeaveApprovals();

}


/* =====================================================
   EMPLOYEE LIST
   ===================================================== */

function renderEmployeeList() {

    const users = getUsers();


    const employees =
        users.filter(
            user => user.role === "Employee"
        );


    const container =
        document
            .getElementById("employeeList");


    if (employees.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    👥
                </div>

                <h3>
                    No employees registered
                </h3>

                <p>
                    Registered employees will
                    appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    employees.forEach(
        employee => {

            const item =
                document.createElement("div");


            item.className =
                "employee-item";


            item.innerHTML = `

                <div class="employee-info">

                    <strong>
                        ${escapeHTML(employee.employeeId)}
                    </strong>

                    <p>
                        ${escapeHTML(employee.email)}
                    </p>

                </div>

                <button
                    class="view-button"
                    onclick="viewEmployee('${employee.employeeId}')">

                    View

                </button>

            `;


            container.appendChild(item);

        }
    );

}


/* =====================================================
   VIEW / SWITCH EMPLOYEE
   ===================================================== */

function viewEmployee(employeeId) {

    const users = getUsers();


    const employee =
        users.find(
            user =>
                user.employeeId === employeeId &&
                user.role === "Employee"
        );


    if (!employee) {

        return;

    }


    const section =
        document
            .getElementById(
                "selectedEmployeeSection"
            );


    const container =
        document
            .getElementById(
                "selectedEmployee"
            );


    section.classList.remove("hidden");


    container.innerHTML = `

        <div class="selected-details">

            <div class="detail-box">

                <span>
                    Employee ID
                </span>

                <strong>
                    ${escapeHTML(employee.employeeId)}
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    Email
                </span>

                <strong>
                    ${escapeHTML(employee.email)}
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    Role
                </span>

                <strong>
                    ${escapeHTML(employee.role)}
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    Attendance Records
                </span>

                <strong>
                    ${employee.attendance.length}
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    Leave Requests
                </span>

                <strong>
                    ${employee.leaveRequests.length}
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    Account Status
                </span>

                <strong>
                    ${employee.verified
                        ? "Verified"
                        : "Not Verified"}
                </strong>

            </div>

        </div>

    `;

}


/* =====================================================
   SEARCH EMPLOYEES
   ===================================================== */

function searchEmployees() {

    const search =
        document
            .getElementById("employeeSearch")
            .value
            .toLowerCase();


    const items =
        document.querySelectorAll(
            ".employee-item"
        );


    items.forEach(
        item => {

            const text =
                item.textContent
                    .toLowerCase();


            if (text.includes(search)) {

                item.style.display = "flex";

            }
            else {

                item.style.display = "none";

            }

        }
    );

}


/* =====================================================
   ATTENDANCE RECORDS
   ===================================================== */

function renderAttendanceRecords() {

    const users = getUsers();


    const employees =
        users.filter(
            user => user.role === "Employee"
        );


    const container =
        document
            .getElementById(
                "hrAttendanceRecords"
            );


    const records = [];


    employees.forEach(
        employee => {

            if (!employee.attendance) {

                return;

            }


            employee.attendance.forEach(
                record => {

                    records.push({

                        employeeId:
                            employee.employeeId,

                        date:
                            record.date,

                        status:
                            record.status

                    });

                }
            );

        }
    );


    if (records.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📊
                </div>

                <h3>
                    No attendance records
                </h3>

                <p>
                    Attendance records will
                    appear here when available.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Employee ID
                    </th>

                    <th>
                        Date
                    </th>

                    <th>
                        Status
                    </th>

                </tr>

            </thead>

            <tbody>

                ${records.map(
                    record => `

                    <tr>

                        <td>
                            ${escapeHTML(
                                record.employeeId
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                record.date
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                record.status
                            )}
                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;

}


/* =====================================================
   LEAVE APPROVALS
   ===================================================== */

function renderLeaveApprovals() {

    const users = getUsers();


    const employees =
        users.filter(
            user => user.role === "Employee"
        );


    const requests = [];


    employees.forEach(
        employee => {

            if (!employee.leaveRequests) {

                return;

            }


            employee.leaveRequests.forEach(
                request => {

                    requests.push({

                        employeeId:
                            employee.employeeId,

                        type:
                            request.type,

                        from:
                            request.from,

                        to:
                            request.to,

                        status:
                            request.status

                    });

                }
            );

        }
    );


    const container =
        document
            .getElementById(
                "hrLeaveApprovals"
            );


    if (requests.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📝
                </div>

                <h3>
                    No leave requests
                </h3>

                <p>
                    Employee leave requests
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    requests.forEach(
        request => {

            const div =
                document.createElement("div");


            div.className =
                "employee-item";


            div.innerHTML = `

                <div class="employee-info">

                    <strong>
                        ${escapeHTML(
                            request.employeeId
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            request.type
                        )}
                        |
                        ${escapeHTML(
                            request.from
                        )}
                        -
                        ${escapeHTML(
                            request.to
                        )}
                    </p>

                </div>


                <strong>
                    ${escapeHTML(
                        request.status
                    )}
                </strong>

            `;


            container.appendChild(div);

        }
    );

}


/* =====================================================
   EMPLOYEE PROFILE
   ===================================================== */

function showProfile() {

    const user = getCurrentUser();


    hideAllPages();


    document
        .getElementById("profilePage")
        .classList.remove("hidden");


    document
        .getElementById("dashboardTitle")
        .textContent =
        "My Profile";


    document
        .getElementById("welcomeText")
        .textContent =
        "View your account information.";


    document
        .getElementById("profileEmployeeId")
        .textContent =
        user.employeeId;


    document
        .getElementById("profileEmail")
        .textContent =
        user.email;


    document
        .getElementById("profileRole")
        .textContent =
        user.role;

}


/* =====================================================
   EMPLOYEE ATTENDANCE
   ===================================================== */

function showAttendance() {

    hideAllPages();


    document
        .getElementById("attendancePage")
        .classList.remove("hidden");


    document
        .getElementById("dashboardTitle")
        .textContent =
        "My Attendance";


    document
        .getElementById("welcomeText")
        .textContent =
        "View your attendance records.";

}


/* =====================================================
   EMPLOYEE LEAVE
   ===================================================== */

function showLeaveRequests() {

    hideAllPages();


    document
        .getElementById("leavePage")
        .classList.remove("hidden");


    document
        .getElementById("dashboardTitle")
        .textContent =
        "Leave Requests";


    document
        .getElementById("welcomeText")
        .textContent =
        "View and manage your leave requests.";

}


/* =====================================================
   HR EMPLOYEES
   ===================================================== */

function showEmployees() {

    hideAllPages();


    document
        .getElementById("hrDashboard")
        .classList.remove("hidden");


    document
        .getElementById("dashboardTitle")
        .textContent =
        "Employee List";


    document
        .getElementById("welcomeText")
        .textContent =
        "View and switch between employees.";


    updateHRDashboard();

}


/* =====================================================
   HR ATTENDANCE
   ===================================================== */

function showAttendanceRecords() {

    hideAllPages();


    document
        .getElementById("hrDashboard")
        .classList.remove("hidden");


    document
        .getElementById("dashboardTitle")
        .textContent =
        "Attendance Records";


    document
        .getElementById("welcomeText")
        .textContent =
        "View employee attendance records.";


    updateHRDashboard();


    document
        .getElementById(
            "hrAttendanceRecords"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   HR LEAVE APPROVALS
   ===================================================== */

function showLeaveApprovals() {

    hideAllPages();


    document
        .getElementById("hrDashboard")
        .classList.remove("hidden");


    document
        .getElementById("dashboardTitle")
        .textContent =
        "Leave Approvals";


    document
        .getElementById("welcomeText")
        .textContent =
        "Review employee leave requests.";


    updateHRDashboard();


    document
        .getElementById(
            "hrLeaveApprovals"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   HIDE ALL DASHBOARD PAGES
   ===================================================== */

function hideAllPages() {

    document
        .querySelectorAll(".dashboard-page")
        .forEach(
            page =>
                page.classList.add("hidden")
        );

}


/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {

    clearCurrentUser();


    document
        .getElementById("dashboardSection")
        .classList.add("hidden");


    document
        .getElementById("authSection")
        .classList.remove("hidden");


    document
        .getElementById("loginForm")
        .reset();


    showLogin();

}


/* =====================================================
   SECURITY HELPER
   ===================================================== */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* =====================================================
   CHECK LOGIN WHEN PAGE LOADS
   ===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const currentUser =
            getCurrentUser();


        if (currentUser) {

            openDashboard();

        }
        else {

            showLogin();

        }

    }
);