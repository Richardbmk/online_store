[
    {
        "name": "ecommerce-app",
        "image": "${app_image}",
        "essential": true,
        "memoryReservation": 256,
        "environment": [
            {"name": "DB_NAME", "value": "${DB_NAME}"},
            {"name": "DB_USERNAME", "value": "${DB_USERNAME}"},
            {"name": "DB_PASSWORD", "value": "${DB_PASSWORD}"}
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
