<?php
// Include database connection
require_once 'db_config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Registrations - Admin</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(to bottom, #1a1a2e, #16213e);
            min-height: 100vh;
            padding: 2rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        h1 {
            color: #ff6b6b;
            text-align: center;
            margin-bottom: 2rem;
            border-bottom: 3px solid #4ecdc4;
            padding-bottom: 1rem;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .stat-box {
            background: linear-gradient(135deg, #4ecdc4, #44a8ac);
            color: white;
            padding: 1.5rem;
            border-radius: 10px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
        }
        
        .stat-label {
            font-size: 1rem;
            opacity: 0.9;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        
        th {
            background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: bold;
        }
        
        td {
            padding: 1rem;
            border-bottom: 1px solid #ddd;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .no-data {
            text-align: center;
            padding: 3rem;
            color: #666;
            font-size: 1.2rem;
        }
        
        .back-btn {
            display: inline-block;
            background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            text-decoration: none;
            margin-bottom: 2rem;
            transition: transform 0.3s ease;
        }
        
        .back-btn:hover {
            transform: translateY(-2px);
        }
        
        .export-btn {
            float: right;
            background: #4ecdc4;
            color: white;
            padding: 0.7rem 1.5rem;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease;
        }
        
        .export-btn:hover {
            background: #44a8ac;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="index.php" class="back-btn">← Back to Event Page</a>
        <button class="export-btn" onclick="exportToCSV()">Export to CSV</button>
        
        <h1>📊 Event Registrations Dashboard</h1>
        
        <?php
        // Get total registrations count
        $count_query = "SELECT COUNT(*) as total FROM registrations";
        $count_result = $conn->query($count_query);
        $total = $count_result->fetch_assoc()['total'];
        
        // Calculate total revenue (20 GHC per registration)
        $revenue = $total * 20;
        
        // Get average age
        $avg_age_query = "SELECT AVG(age) as avg_age FROM registrations";
        $avg_result = $conn->query($avg_age_query);
        $avg_age = round($avg_result->fetch_assoc()['avg_age'], 1);
        ?>
        
        <div class="stats">
            <div class="stat-box">
                <div class="stat-number"><?php echo $total; ?></div>
                <div class="stat-label">Total Registrations</div>
            </div>
            <div class="stat-box">
                <div class="stat-number"><?php echo $revenue; ?> GHC</div>
                <div class="stat-label">Total Revenue</div>
            </div>
            <div class="stat-box">
                <div class="stat-number"><?php echo $avg_age; ?></div>
                <div class="stat-label">Average Age</div>
            </div>
            <div class="stat-box">
                <div class="stat-number"><?php echo max(0, 100 - $total); ?></div>
                <div class="stat-label">Spots Remaining</div>
            </div>
        </div>
        
        <h2 style="color: #333; margin-top: 2rem; margin-bottom: 1rem;">All Registrations</h2>
        
        <?php
        // Fetch all registrations from database
        $sql = "SELECT * FROM registrations ORDER BY registration_date DESC";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            echo "<table id='registrations-table'>";
            echo "<thead>";
            echo "<tr>";
            echo "<th>ID</th>";
            echo "<th>Full Name</th>";
            echo "<th>Email</th>";
            echo "<th>Phone</th>";
            echo "<th>Age</th>";
            echo "<th>Registration Date</th>";
            echo "</tr>";
            echo "</thead>";
            echo "<tbody>";
            
            // Output data for each row
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row["id"] . "</td>";
                echo "<td>" . htmlspecialchars($row["full_name"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["email"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["phone"]) . "</td>";
                echo "<td>" . $row["age"] . "</td>";
                echo "<td>" . date("d M Y, g:i A", strtotime($row["registration_date"])) . "</td>";
                echo "</tr>";
            }
            
            echo "</tbody>";
            echo "</table>";
        } else {
            echo "<div class='no-data'>No registrations yet. Be the first to register! 🎮</div>";
        }
        
        // Close connection
        $conn->close();
        ?>
    </div>
    
    <script>
        // Function to export table data to CSV
        function exportToCSV() {
            const table = document.getElementById('registrations-table');
            if (!table) {
                alert('No data to export!');
                return;
            }
            
            let csv = [];
            const rows = table.querySelectorAll('tr');
            
            for (let i = 0; i < rows.length; i++) {
                const row = [];
                const cols = rows[i].querySelectorAll('td, th');
                
                for (let j = 0; j < cols.length; j++) {
                    row.push(cols[j].innerText);
                }
                
                csv.push(row.join(','));
            }
            
            // Create download link
            const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
            const downloadLink = document.createElement('a');
            downloadLink.download = 'registrations_' + new Date().toISOString().slice(0,10) + '.csv';
            downloadLink.href = window.URL.createObjectURL(csvFile);
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    </script>
</body>
</html>