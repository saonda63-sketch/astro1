import ephem
import math
from datetime import datetime
import pytz

class AstrologyEngine:
    """Core astrology calculations engine"""
    
    # Zodiac signs with date ranges
    ZODIAC_SIGNS = [
        {"name": "Aries", "start": (3, 21), "end": (4, 19), "symbol": "♈"},
        {"name": "Taurus", "start": (4, 20), "end": (5, 20), "symbol": "♉"},
        {"name": "Gemini", "start": (5, 21), "end": (6, 20), "symbol": "♊"},
        {"name": "Cancer", "start": (6, 21), "end": (7, 22), "symbol": "♋"},
        {"name": "Leo", "start": (7, 23), "end": (8, 22), "symbol": "♌"},
        {"name": "Virgo", "start": (8, 23), "end": (9, 22), "symbol": "♍"},
        {"name": "Libra", "start": (9, 23), "end": (10, 22), "symbol": "♎"},
        {"name": "Scorpio", "start": (10, 23), "end": (11, 21), "symbol": "♏"},
        {"name": "Sagittarius", "start": (11, 22), "end": (12, 21), "symbol": "♐"},
        {"name": "Capricorn", "start": (12, 22), "end": (1, 19), "symbol": "♑"},
        {"name": "Aquarius", "start": (1, 20), "end": (2, 18), "symbol": "♒"},
        {"name": "Pisces", "start": (2, 19), "end": (3, 20), "symbol": "♓"},
    ]
    
    # Element mapping
    ELEMENTS = {
        "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
        "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
        "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
        "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water",
    }
    
    # Planet characteristics for predictions
    PLANET_MEANINGS = {
        "Sun": {"strength": "identity", "positive": "confidence, leadership"},
        "Moon": {"strength": "emotions", "positive": "intuition, sensitivity"},
        "Mercury": {"strength": "communication", "positive": "intellect, analysis"},
        "Venus": {"strength": "relationships", "positive": "love, beauty"},
        "Mars": {"strength": "drive", "positive": "courage, ambition"},
        "Jupiter": {"strength": "fortune", "positive": "expansion, luck"},
        "Saturn": {"strength": "discipline", "positive": "responsibility, wisdom"},
    }
    
    def __init__(self):
        self.observer = ephem.Observer()
    
    def get_sun_sign(self, birth_date):
        """Calculate sun sign (zodiac) based on birth date"""
        month, day = birth_date.month, birth_date.day
        
        for sign in self.ZODIAC_SIGNS:
            start_month, start_day = sign["start"]
            end_month, end_day = sign["end"]
            
            if start_month == end_month:
                if start_day <= day <= end_day:
                    return sign
            else:
                if (month == start_month and day >= start_day) or (month == end_month and day <= end_day):
                    return sign
        
        return self.ZODIAC_SIGNS[0]
    
    def get_planetary_positions(self, birth_date, latitude, longitude):
        """Calculate planetary positions at birth time"""
        self.observer.lat = str(latitude)
        self.observer.lon = str(longitude)
        self.observer.date = birth_date
        
        positions = {}
        planets = [ephem.Sun(), ephem.Moon(), ephem.Mercury(), 
                   ephem.Venus(), ephem.Mars(), ephem.Jupiter(), ephem.Saturn()]
        planet_names = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"]
        
        for planet, name in zip(planets, planet_names):
            planet.compute(self.observer)
            positions[name] = {
                "ra": float(planet.ra),
                "dec": float(planet.dec),
                "alt": float(planet.alt),
                "az": float(planet.az)
            }
        
        return positions
    
    def calculate_life_path_number(self, birth_date):
        """Calculate life path number from birth date (numerology)"""
        total = sum(int(digit) for digit in birth_date.strftime("%Y%m%d"))
        while total > 9:
            total = sum(int(digit) for digit in str(total))
        return total
    
    def generate_birth_chart_analysis(self, name, birth_date, latitude, longitude, gender):
        """Generate comprehensive birth chart analysis"""
        sun_sign = self.get_sun_sign(birth_date)
        element = self.ELEMENTS.get(sun_sign["name"], "Unknown")
        life_path = self.calculate_life_path_number(birth_date)
        
        analysis = {
            "name": name,
            "birth_date": birth_date.strftime("%Y-%m-%d"),
            "gender": gender,
            "location": {"latitude": latitude, "longitude": longitude},
            "sun_sign": sun_sign,
            "element": element,
            "life_path_number": life_path,
            "characteristics": self._get_sign_characteristics(sun_sign["name"]),
            "planetary_positions": self.get_planetary_positions(birth_date, latitude, longitude),
        }
        
        return analysis
    
    def _get_sign_characteristics(self, sign_name):
        """Get personality characteristics for a zodiac sign"""
        characteristics = {
            "Aries": {
                "traits": ["Courageous", "Passionate", "Determined", "Independent"],
                "strengths": ["Leadership", "Initiative", "Enthusiasm"],
                "weaknesses": ["Impulsivity", "Aggressive", "Impatient"],
                "compatibility": ["Leo", "Sagittarius", "Gemini", "Aquarius"]
            },
            "Taurus": {
                "traits": ["Reliable", "Patient", "Practical", "Devoted"],
                "strengths": ["Stability", "Loyalty", "Determination"],
                "weaknesses": ["Stubbornness", "Possessiveness", "Materialism"],
                "compatibility": ["Capricorn", "Virgo", "Cancer", "Pisces"]
            },
            "Gemini": {
                "traits": ["Curious", "Adaptable", "Outgoing", "Intelligent"],
                "strengths": ["Communication", "Versatility", "Mental Agility"],
                "weaknesses": ["Inconsistency", "Nervousness", "Superficiality"],
                "compatibility": ["Aquarius", "Libra", "Aries", "Leo"]
            },
            "Cancer": {
                "traits": ["Emotional", "Intuitive", "Protective", "Loyal"],
                "strengths": ["Empathy", "Intuition", "Nurturing"],
                "weaknesses": ["Moodiness", "Insecurity", "Manipulation"],
                "compatibility": ["Pisces", "Scorpio", "Taurus", "Virgo"]
            },
            "Leo": {
                "traits": ["Confident", "Generous", "Warm", "Creative"],
                "strengths": ["Leadership", "Confidence", "Creativity"],
                "weaknesses": ["Arrogance", "Pride", "Stubbornness"],
                "compatibility": ["Sagittarius", "Aries", "Gemini", "Libra"]
            },
            "Virgo": {
                "traits": ["Analytical", "Practical", "Modest", "Reliable"],
                "strengths": ["Perfection", "Analysis", "Reliability"],
                "weaknesses": ["Overthinking", "Criticism", "Worry"],
                "compatibility": ["Capricorn", "Taurus", "Cancer", "Scorpio"]
            },
            "Libra": {
                "traits": ["Diplomatic", "Fair", "Social", "Artistic"],
                "strengths": ["Balance", "Diplomacy", "Artistry"],
                "weaknesses": ["Indecision", "Avoidance", "Superficiality"],
                "compatibility": ["Aquarius", "Gemini", "Leo", "Sagittarius"]
            },
            "Scorpio": {
                "traits": ["Passionate", "Secretive", "Intense", "Determined"],
                "strengths": ["Passion", "Intuition", "Power"],
                "weaknesses": ["Secretiveness", "Jealousy", "Obsession"],
                "compatibility": ["Pisces", "Cancer", "Virgo", "Capricorn"]
            },
            "Sagittarius": {
                "traits": ["Optimistic", "Adventurous", "Honest", "Philosophical"],
                "strengths": ["Optimism", "Adventure", "Honesty"],
                "weaknesses": ["Overconfidence", "Carelessness", "Bluntness"],
                "compatibility": ["Aries", "Leo", "Libra", "Aquarius"]
            },
            "Capricorn": {
                "traits": ["Ambitious", "Disciplined", "Responsible", "Self-controlled"],
                "strengths": ["Discipline", "Responsibility", "Ambition"],
                "weaknesses": ["Coldness", "Unforgiving", "Condescending"],
                "compatibility": ["Taurus", "Virgo", "Scorpio", "Pisces"]
            },
            "Aquarius": {
                "traits": ["Independent", "Intellectual", "Humanitarian", "Progressive"],
                "strengths": ["Innovation", "Humanitarianism", "Intellectual"],
                "weaknesses": ["Detachment", "Unpredictability", "Stubbornness"],
                "compatibility": ["Gemini", "Libra", "Sagittarius", "Aries"]
            },
            "Pisces": {
                "traits": ["Compassionate", "Artistic", "Intuitive", "Gentle"],
                "strengths": ["Compassion", "Artistry", "Intuition"],
                "weaknesses": ["Escapism", "Oversensitivity", "Fearfulness"],
                "compatibility": ["Cancer", "Scorpio", "Taurus", "Capricorn"]
            },
        }
        
        return characteristics.get(sign_name, {})
    
    def generate_life_prediction(self, birth_date, gender):
        """Generate life predictions based on birth data"""
        from datetime import datetime, timedelta
        
        today = datetime.now()
        age = (today - birth_date).days // 365
        
        # Calculate life phases (simplified model)
        childhood_end = 18
        young_adult_end = 25
        adult_end = 50
        senior_start = 65
        
        current_phase = "Childhood"
        if age >= childhood_end and age < young_adult_end:
            current_phase = "Young Adult"
        elif age >= young_adult_end and age < adult_end:
            current_phase = "Adult"
        elif age >= adult_end and age < senior_start:
            current_phase = "Middle Age"
        elif age >= senior_start:
            current_phase = "Senior"
        
        prediction = {
            "current_age": age,
            "current_life_phase": current_phase,
            "past_prediction": self._generate_past_prediction(age, gender),
            "present_prediction": self._generate_present_prediction(age, gender),
            "future_prediction": self._generate_future_prediction(age, gender),
        }
        
        return prediction
    
    def _generate_past_prediction(self, age, gender):
        """Generate prediction for past (birth to now)"""
        return {
            "summary": f"You have lived {age} years of your life journey.",
            "highlights": [
                "Foundation building phase where you developed your core personality",
                "Learning and growth through various life experiences",
                "Development of relationships and social connections",
                "Building of professional and personal skills"
            ],
            "lessons": [
                "Every experience has shaped your character",
                "Your resilience has helped you overcome challenges",
                "You have grown from your mistakes and successes"
            ]
        }
    
    def _generate_present_prediction(self, age, gender):
        """Generate prediction for present"""
        phase_predictions = {
            "young_adult": "This is a transformative period. Focus on self-discovery, building relationships, and establishing your career foundation.",
            "adult": "You are in your prime earning and achievement years. Balance ambition with personal relationships.",
            "middle_age": "Wisdom and experience are your assets. Focus on legacy building and mentoring others.",
            "senior": "Reflect on your life achievements and share your wisdom. Family and spiritual growth become important.",
        }
        
        if age < 25:
            phase_key = "young_adult"
        elif age < 50:
            phase_key = "adult"
        elif age < 65:
            phase_key = "middle_age"
        else:
            phase_key = "senior"
        
        return {
            "current_focus": phase_predictions.get(phase_key, "Live meaningfully"),
            "opportunities": [
                "Personal growth and development",
                "Career advancement and professional achievements",
                "Building and strengthening relationships",
                "Pursuing passions and hobbies"
            ],
            "challenges": [
                "Balancing personal and professional life",
                "Managing stress and health",
                "Making important life decisions",
                "Adapting to life changes"
            ]
        }
    
    def _generate_future_prediction(self, age, gender):
        """Generate prediction for future (next 10 years)"""
        years_ahead = 10
        future_age = age + years_ahead
        
        return {
            "timeframe": f"Next {years_ahead} years (age {age} to {future_age})",
            "potential_outcomes": [
                "Continued personal growth and self-improvement",
                "Possible career transitions or advancements",
                "Deepening of meaningful relationships",
                "Achievement of long-term goals"
            ],
            "recommendations": [
                "Set clear personal and professional goals",
                "Invest in continuous learning and skill development",
                "Nurture important relationships",
                "Maintain physical and mental health",
                "Plan for financial security",
                "Explore spiritual or personal development"
            ],
            "numerology_insight": "The stars suggest a period of growth and positive change if you align your actions with your values."
        }
