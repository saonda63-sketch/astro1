from flask import Flask, request, jsonify
from flask_cors import CORS
from astrology_engine import AstrologyEngine
from datetime import datetime
import pytz
import os

app = Flask(__name__)
CORS(app)

# Initialize astrology engine
astro_engine = AstrologyEngine()

# Store predictions (in production, use a database)
predictions_storage = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Astrology API"}), 200

@app.route('/api/predict', methods=['POST'])
def get_prediction():
    """Main prediction endpoint"""
    try:
        data = request.json
        
        # Validate input
        required_fields = ['name', 'birth_date', 'birth_time', 'latitude', 'longitude', 'gender']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
        
        name = data.get('name', '').strip()
        birth_date_str = data.get('birth_date')  # Format: YYYY-MM-DD
        birth_time_str = data.get('birth_time')  # Format: HH:MM
        latitude = float(data.get('latitude'))
        longitude = float(data.get('longitude'))
        gender = data.get('gender', '').strip()
        
        # Validate input data
        if not name or len(name) < 2:
            return jsonify({"error": "Name must be at least 2 characters"}), 400
        
        if gender not in ['Male', 'Female', 'Other']:
            return jsonify({"error": "Gender must be Male, Female, or Other"}), 400
        
        # Parse datetime
        try:
            birth_datetime = datetime.strptime(f"{birth_date_str} {birth_time_str}", "%Y-%m-%d %H:%M")
        except ValueError:
            return jsonify({"error": "Invalid date or time format. Use YYYY-MM-DD and HH:MM"}), 400
        
        # Validate coordinates
        if latitude < -90 or latitude > 90 or longitude < -180 or longitude > 180:
            return jsonify({"error": "Invalid latitude or longitude"}), 400
        
        # Generate birth chart analysis
        birth_chart = astro_engine.generate_birth_chart_analysis(
            name, birth_datetime, latitude, longitude, gender
        )
        
        # Generate life predictions
        predictions = astro_engine.generate_life_prediction(birth_datetime, gender)
        
        # Combine results
        result = {
            "success": True,
            "birth_chart": birth_chart,
            "predictions": predictions,
            "advice": get_personalized_advice(birth_chart, predictions, gender)
        }
        
        # Store prediction (optional, for tracking)
        prediction_id = f"{name}_{datetime.now().timestamp()}"
        predictions_storage[prediction_id] = result
        result['prediction_id'] = prediction_id
        
        return jsonify(result), 200
    
    except ValueError as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/zodiac-compatibility', methods=['POST'])
def check_compatibility():
    """Check zodiac compatibility between two people"""
    try:
        data = request.json
        
        sign1 = data.get('sign1', '').strip()
        sign2 = data.get('sign2', '').strip()
        
        if not sign1 or not sign2:
            return jsonify({"error": "Both signs required"}), 400
        
        # Get compatibility from zodiac characteristics
        engine = AstrologyEngine()
        characteristics = engine._get_sign_characteristics(sign1)
        compatibility_list = characteristics.get('compatibility', [])
        
        compatibility_score = 90 if sign2 in compatibility_list else 60
        
        return jsonify({
            "sign1": sign1,
            "sign2": sign2,
            "compatibility_score": compatibility_score,
            "compatible": sign2 in compatibility_list,
            "description": f"{sign1} and {sign2} have a {'strong' if sign2 in compatibility_list else 'moderate'} connection."
        }), 200
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/zodiac-signs', methods=['GET'])
def get_zodiac_signs():
    """Get all zodiac signs"""
    try:
        signs = []
        for sign in astro_engine.ZODIAC_SIGNS:
            signs.append({
                "name": sign["name"],
                "symbol": sign["symbol"],
                "element": astro_engine.ELEMENTS[sign["name"]],
                "dates": f"{sign['start'][0]}/{sign['start'][1]} - {sign['end'][0]}/{sign['end'][1]}"
            })
        return jsonify({"zodiac_signs": signs}), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/predictions/<prediction_id>', methods=['GET'])
def get_prediction_by_id(prediction_id):
    """Retrieve a stored prediction"""
    try:
        if prediction_id in predictions_storage:
            return jsonify(predictions_storage[prediction_id]), 200
        else:
            return jsonify({"error": "Prediction not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

def get_personalized_advice(birth_chart, predictions, gender):
    """Generate personalized advice based on analysis"""
    sun_sign = birth_chart['sun_sign']['name']
    current_phase = predictions['current_life_phase']
    life_path = birth_chart['life_path_number']
    
    advice = {
        "career": f"As a {sun_sign}, you excel in roles that allow you to express your natural strengths.",
        "relationships": f"Your {sun_sign} nature brings unique qualities to relationships. Focus on understanding your partner's needs.",
        "health": "Maintain physical activity, manage stress through meditation or yoga, and ensure adequate sleep.",
        "finances": f"Your life path number {life_path} suggests success through disciplined planning and strategic investments.",
        "spiritual": "Explore meditation, journaling, or spiritual practices that resonate with your inner self.",
        "general": f"You are in your {current_phase} phase. Focus on meaningful growth and positive relationships."
    }
    
    return advice

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=os.getenv('DEBUG', 'False') == 'True', host='0.0.0.0', port=port)
