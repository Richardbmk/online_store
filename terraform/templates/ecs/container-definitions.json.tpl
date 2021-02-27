[
    {
        "name": "ecommerce-app",
        "image": "${app_image}",
        "essential": true,
        "memoryReservation": 256,
        "environment": [
            {"name": "DB_NAME", "value": "${db_name}"},
            {"name": "DB_USERNAME", "value": "${db_username}"},
            {"name": "DB_PASSWORD", "value": "${db_password}"},
            {"name": "SENDGRID_API_KEY", "value": "${sendgrid_api_key}"},
            {"name": "STRIPE_KEY", "value": "${stripe_secret_key}"}
        ],
        "logConfiguration": {
            "logDriver": "awslogs",
            "options": {
                "awslogs-group": "${log_group_name}",
                "awslogs-region": "${log_group_region}",
                "awslogs-stream-prefix": "app"
            }
        },
        "portMappings": [
            {
                "containerPort": 3000,
                "hostPort": 3000
            }
        ]
    }
]
