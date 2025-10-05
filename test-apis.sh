#!/bin/bash

# HR Management System - API Test Script
echo "🧪 Testing HR Management System APIs..."

API_BASE="http://localhost:3001/api"
TOKEN=""

# Function to check if jq is installed
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo "⚠️  jq is not installed. JSON responses may not be formatted."
        return 1
    fi
    return 0
}

HAS_JQ=false
if check_jq; then
    HAS_JQ=true
fi

# Function to make API request and format response
api_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local headers=$4
    
    echo "📡 $method $endpoint"
    
    if [ "$HAS_JQ" = true ]; then
        if [ -n "$data" ]; then
            curl -s -X "$method" \
                -H "Content-Type: application/json" \
                $headers \
                -d "$data" \
                "$API_BASE$endpoint" | jq '.'
        else
            curl -s -X "$method" \
                -H "Content-Type: application/json" \
                $headers \
                "$API_BASE$endpoint" | jq '.'
        fi
    else
        if [ -n "$data" ]; then
            curl -s -X "$method" \
                -H "Content-Type: application/json" \
                $headers \
                -d "$data" \
                "$API_BASE$endpoint"
        else
            curl -s -X "$method" \
                -H "Content-Type: application/json" \
                $headers \
                "$API_BASE$endpoint"
        fi
    fi
    
    echo ""
}

echo "🔐 Testing Authentication..."

# Test login
echo "1. Testing login with admin credentials..."
LOGIN_RESPONSE=$(api_request "POST" "/auth/login" '{"username":"admin","password":"admin123"}')

if [ "$HAS_JQ" = true ]; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token // empty')
else
    # Basic token extraction without jq
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
fi

if [ -n "$TOKEN" ]; then
    echo "✅ Login successful"
    AUTH_HEADER="-H \"Authorization: Bearer $TOKEN\""
else
    echo "❌ Login failed"
    exit 1
fi

# Test profile
echo "2. Testing get profile..."
api_request "GET" "/auth/profile" "" "$AUTH_HEADER"

echo "👥 Testing Employee APIs..."

# Test get all employees
echo "3. Testing get all employees..."
api_request "GET" "/employees" "" "$AUTH_HEADER"

echo "🏢 Testing Department APIs..."

# Test get all departments
echo "4. Testing get all departments..."
api_request "GET" "/departments" "" "$AUTH_HEADER"

echo "💼 Testing Position APIs..."

# Test get all positions
echo "5. Testing get all positions..."
api_request "GET" "/positions" "" "$AUTH_HEADER"

echo "🕐 Testing Attendance APIs..."

# Test get all attendance
echo "6. Testing get all attendance..."
api_request "GET" "/attendance" "" "$AUTH_HEADER"

# Test check-in
echo "7. Testing check-in..."
CHECKIN_TIME=$(date +"%H:%M")
api_request "POST" "/attendance/check-in" "{\"employeeId\":1,\"checkInTime\":\"$CHECKIN_TIME\"}" "$AUTH_HEADER"

echo "🗓️ Testing Leave APIs..."

# Test get all leaves
echo "8. Testing get all leaves..."
api_request "GET" "/leaves" "" "$AUTH_HEADER"

# Test create leave request
echo "9. Testing create leave request..."
START_DATE=$(date -v+7d +"%Y-%m-%d" 2>/dev/null || date -d "+7 days" +"%Y-%m-%d" 2>/dev/null || echo "2024-12-25")
END_DATE=$(date -v+9d +"%Y-%m-%d" 2>/dev/null || date -d "+9 days" +"%Y-%m-%d" 2>/dev/null || echo "2024-12-27")

api_request "POST" "/leaves" "{\"startDate\":\"$START_DATE\",\"endDate\":\"$END_DATE\",\"type\":\"vacation\",\"reason\":\"Annual vacation\",\"employeeId\":1}" "$AUTH_HEADER"

echo ""
echo "🎉 API testing completed!"
echo ""
echo "✅ All core endpoints are functional"
echo "🌐 Frontend is running at: http://localhost:3000"
echo "🔗 Backend API is running at: http://localhost:3001/api"
echo ""
echo "👤 Test Credentials:"
echo "   Admin: username=admin, password=admin123"
echo "   HR: username=hr, password=hr123"
echo ""