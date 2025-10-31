<?php
// Include database connection
require_once 'db_config.php';

// Initialize response array
$response = array();

// Check if form is submitted via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get form data and sanitize it
    $full_name = mysqli_real_escape_string($conn, trim($_POST['full-name']));
    $email = mysqli_real_escape_string($conn, trim($_POST['email']));
    $phone = mysqli_real_escape_string($conn, trim($_POST['phone']));
    $age = intval($_POST['age']); // Convert to integer
    
    // Validate data
    $errors = array();
    
    // Check if all fields are filled
    if (empty($full_name)) {
        $errors[] = "Full name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($phone)) {
        $errors[] = "Phone number is required";
    }
    
    if ($age < 18) {
        $errors[] = "You must be 18 or older to register";
    }
    
    // Check if email already exists in database
    $check_email_query = "SELECT email FROM registrations WHERE email = ?";
    $stmt = $conn->prepare($check_email_query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        $errors[] = "This email is already registered";
    }
    $stmt->close();
    
    // If no errors, insert into database
    if (empty($errors)) {
        // Prepare SQL statement to prevent SQL injection
        $sql = "INSERT INTO registrations (full_name, email, phone, age) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $full_name, $email, $phone, $age);
        
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = "Registration successful! You'll receive a confirmation SMS soon.";
            $response['registration_id'] = $stmt->insert_id;
        } else {
            $response['success'] = false;
            $response['message'] = "Error: " . $stmt->error;
        }
        
        $stmt->close();
    } else {
        // Return validation errors
        $response['success'] = false;
        $response['message'] = implode(", ", $errors);
    }
    
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request method";
}

// Close connection
$conn->close();

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>