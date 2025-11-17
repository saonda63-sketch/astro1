# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently no authentication required. (Add in future versions)

## Response Format
All responses are JSON.

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## Endpoints

### 1. Health Check

**Endpoint**: `GET /health`

**Description**: Check if API is running

**Response**:
```json
{
  "status": "healthy",
  "service": "Astrology API"
}
```

---

### 2. Get Prediction

**Endpoint**: `POST /predict`

**Description**: Generate complete astrological prediction for a person

**Request Body**:
```json
{
  "name": "string (required)",
  "birth_date": "YYYY-MM-DD (required)",
  "birth_time": "HH:MM (required)",
  "latitude": "number -90 to 90 (required)",
  "longitude": "number -180 to 180 (required)",
  "gender": "Male|Female|Other (required)"
}
```

**Example Request**:
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "birth_date": "1990-01-15",
    "birth_time": "14:30",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "gender": "Male"
  }'
```

**Response**:
```json
{
  "success": true,
  "prediction_id": "John Doe_1234567890.0",
  "birth_chart": {
    "name": "John Doe",
    "birth_date": "1990-01-15",
    "gender": "Male",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "sun_sign": {
      "name": "Capricorn",
      "symbol": "♑"
    },
    "element": "Earth",
    "life_path_number": 5,
    "characteristics": {
      "traits": ["Ambitious", "Disciplined", ...],
      "strengths": ["Discipline", "Responsibility", ...],
      "weaknesses": ["Coldness", "Unforgiving", ...],
      "compatibility": ["Taurus", "Virgo", ...]
    },
    "planetary_positions": {
      "Sun": {"ra": 0.0, "dec": 0.0, ...},
      "Moon": {...},
      ...
    }
  },
  "predictions": {
    "current_age": 34,
    "current_life_phase": "Adult",
    "past_prediction": {
      "summary": "...",
      "highlights": [...],
      "lessons": [...]
    },
    "present_prediction": {
      "current_focus": "...",
      "opportunities": [...],
      "challenges": [...]
    },
    "future_prediction": {
      "timeframe": "Next 10 years (age 34 to 44)",
      "potential_outcomes": [...],
      "recommendations": [...],
      "numerology_insight": "..."
    }
  },
  "advice": {
    "career": "...",
    "relationships": "...",
    "health": "...",
    "finances": "...",
    "spiritual": "...",
    "general": "..."
  }
}
```

**Error Responses**:
- 400: Missing or invalid fields
- 500: Server error

---

### 3. Get Zodiac Signs

**Endpoint**: `GET /zodiac-signs`

**Description**: Get list of all zodiac signs with details

**Response**:
```json
{
  "zodiac_signs": [
    {
      "name": "Aries",
      "symbol": "♈",
      "element": "Fire",
      "dates": "3/21 - 4/19"
    },
    {
      "name": "Taurus",
      "symbol": "♉",
      "element": "Earth",
      "dates": "4/20 - 5/20"
    },
    ...
  ]
}
```

---

### 4. Check Zodiac Compatibility

**Endpoint**: `POST /zodiac-compatibility`

**Description**: Check compatibility between two zodiac signs

**Request Body**:
```json
{
  "sign1": "string (zodiac sign name, required)",
  "sign2": "string (zodiac sign name, required)"
}
```

**Example Request**:
```bash
curl -X POST http://localhost:5000/api/zodiac-compatibility \
  -H "Content-Type: application/json" \
  -d '{
    "sign1": "Aries",
    "sign2": "Leo"
  }'
```

**Response**:
```json
{
  "sign1": "Aries",
  "sign2": "Leo",
  "compatibility_score": 90,
  "compatible": true,
  "description": "Aries and Leo have a strong connection."
}
```

**Compatibility Scores**:
- 90: Highly compatible
- 60: Moderately compatible
- 40: Low compatibility

---

### 5. Retrieve Stored Prediction

**Endpoint**: `GET /predictions/<prediction_id>`

**Description**: Get a previously generated prediction by ID

**Parameters**:
- `prediction_id` (string): The prediction ID returned from /predict

**Example Request**:
```bash
curl http://localhost:5000/api/predictions/John%20Doe_1234567890.0
```

**Response**: Same as POST /predict response

**Error Response**:
```json
{
  "error": "Prediction not found"
}
```

---

## Zodiac Signs Reference

| Sign | Symbol | Element | Dates |
|------|--------|---------|-------|
| Aries | ♈ | Fire | 3/21-4/19 |
| Taurus | ♉ | Earth | 4/20-5/20 |
| Gemini | ♊ | Air | 5/21-6/20 |
| Cancer | ♋ | Water | 6/21-7/22 |
| Leo | ♌ | Fire | 7/23-8/22 |
| Virgo | ♍ | Earth | 8/23-9/22 |
| Libra | ♎ | Air | 9/23-10/22 |
| Scorpio | ♏ | Water | 10/23-11/21 |
| Sagittarius | ♐ | Fire | 11/22-12/21 |
| Capricorn | ♑ | Earth | 12/22-1/19 |
| Aquarius | ♒ | Air | 1/20-2/18 |
| Pisces | ♓ | Water | 2/19-3/20 |

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting. Will be implemented in production.

## Pagination

Not applicable to current endpoints.

## Filtering & Sorting

Not applicable to current endpoints.

---

## Code Examples

### Python
```python
import requests
import json

url = "http://localhost:5000/api/predict"
payload = {
    "name": "Jane Doe",
    "birth_date": "1995-06-15",
    "birth_time": "09:30",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "gender": "Female"
}

response = requests.post(url, json=payload)
data = response.json()
print(json.dumps(data, indent=2))
```

### JavaScript (Fetch)
```javascript
const payload = {
    name: "Jane Doe",
    birth_date: "1995-06-15",
    birth_time: "09:30",
    latitude: 40.7128,
    longitude: -74.0060,
    gender: "Female"
};

fetch('http://localhost:5000/api/predict', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(error => console.error('Error:', error));
```

### cURL
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "birth_date": "1995-06-15",
    "birth_time": "09:30",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "gender": "Female"
  }'
```

---

## Future Enhancements

- [ ] User authentication
- [ ] Rate limiting
- [ ] Advanced transits
- [ ] Progressed charts
- [ ] Synastry (relationship charts)
- [ ] Composite charts
- [ ] Return charts
- [ ] Solar arc calculations
- [ ] Aspects analysis
- [ ] House system variations

---

## Support

For API issues or questions:
1. Check this documentation
2. Review example code
3. Create a GitHub issue
4. Contact support

---

**Last Updated**: November 2024
**API Version**: 1.0
