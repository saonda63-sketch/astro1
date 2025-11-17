// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let allZodiacSigns = [];
let currentPredictionData = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadZodiacSigns();
    setupEventListeners();
    populateZodiacSelects();
});

// Event Listeners Setup
function setupEventListeners() {
    const form = document.getElementById('predictionForm');
    if (form) {
        form.addEventListener('submit', handlePredictionSubmit);
    }
}

// Load zodiac signs from API
async function loadZodiacSigns() {
    try {
        const response = await fetch(`${API_BASE_URL}/zodiac-signs`);
        const data = await response.json();
        allZodiacSigns = data.zodiac_signs;
        displayZodiacSigns();
    } catch (error) {
        console.error('Error loading zodiac signs:', error);
        displayZodiacSignsLocal();
    }
}

// Display zodiac signs in grid
function displayZodiacSigns() {
    const grid = document.getElementById('zodiacGrid');
    grid.innerHTML = '';
    
    allZodiacSigns.forEach(sign => {
        const card = document.createElement('div');
        card.className = 'zodiac-card';
        card.innerHTML = `
            <div class="zodiac-symbol">${sign.symbol}</div>
            <div class="zodiac-name">${sign.name}</div>
            <div class="zodiac-dates">${sign.dates}</div>
            <span class="zodiac-element">${sign.element}</span>
        `;
        grid.appendChild(card);
    });
}

// Fallback zodiac signs display
function displayZodiacSignsLocal() {
    const localSigns = [
        {name: "Aries", symbol: "♈", element: "Fire", dates: "3/21 - 4/19"},
        {name: "Taurus", symbol: "♉", element: "Earth", dates: "4/20 - 5/20"},
        {name: "Gemini", symbol: "♊", element: "Air", dates: "5/21 - 6/20"},
        {name: "Cancer", symbol: "♋", element: "Water", dates: "6/21 - 7/22"},
        {name: "Leo", symbol: "♌", element: "Fire", dates: "7/23 - 8/22"},
        {name: "Virgo", symbol: "♍", element: "Earth", dates: "8/23 - 9/22"},
        {name: "Libra", symbol: "♎", element: "Air", dates: "9/23 - 10/22"},
        {name: "Scorpio", symbol: "♏", element: "Water", dates: "10/23 - 11/21"},
        {name: "Sagittarius", symbol: "♐", element: "Fire", dates: "11/22 - 12/21"},
        {name: "Capricorn", symbol: "♑", element: "Earth", dates: "12/22 - 1/19"},
        {name: "Aquarius", symbol: "♒", element: "Air", dates: "1/20 - 2/18"},
        {name: "Pisces", symbol: "♓", element: "Water", dates: "2/19 - 3/20"},
    ];
    
    allZodiacSigns = localSigns;
    const grid = document.getElementById('zodiacGrid');
    grid.innerHTML = '';
    
    localSigns.forEach(sign => {
        const card = document.createElement('div');
        card.className = 'zodiac-card';
        card.innerHTML = `
            <div class="zodiac-symbol">${sign.symbol}</div>
            <div class="zodiac-name">${sign.name}</div>
            <div class="zodiac-dates">${sign.dates}</div>
            <span class="zodiac-element">${sign.element}</span>
        `;
        grid.appendChild(card);
    });
}

// Populate zodiac selects
function populateZodiacSelects() {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    
    const sign1 = document.getElementById('sign1');
    const sign2 = document.getElementById('sign2');
    
    signs.forEach(sign => {
        const option1 = document.createElement('option');
        option1.value = sign;
        option1.textContent = sign;
        sign1.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = sign;
        option2.textContent = sign;
        sign2.appendChild(option2);
    });
}

// Handle prediction form submission
async function handlePredictionSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const birth_date = document.getElementById('birth_date').value;
    const birth_time = document.getElementById('birth_time').value;
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);
    const gender = document.getElementById('gender').value;
    
    // Validation
    if (!name || !birth_date || !birth_time || !latitude || !longitude || !gender) {
        alert('Please fill all required fields');
        return;
    }
    
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        alert('Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180');
        return;
    }
    
    // Show loading spinner
    showSpinner(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                birth_date,
                birth_time,
                latitude,
                longitude,
                gender
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get prediction');
        }
        
        const data = await response.json();
        currentPredictionData = data;
        displayResults(data);
        
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Error:', error);
    } finally {
        showSpinner(false);
    }
}

// Display results
function displayResults(data) {
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';
    
    // Birth Chart
    const birthChart = data.birth_chart;
    const birthChartHTML = `
        <p><strong>Name:</strong> ${birthChart.name}</p>
        <p><strong>Date of Birth:</strong> ${birthChart.birth_date}</p>
        <p><strong>Gender:</strong> ${birthChart.gender}</p>
        <p><strong>Sun Sign:</strong> <span style="color: #06b6d4;">${birthChart.sun_sign.name} ${birthChart.sun_sign.symbol}</span></p>
        <p><strong>Element:</strong> ${birthChart.element}</p>
        <p><strong>Life Path Number:</strong> <span style="color: #10b981;">${birthChart.life_path_number}</span></p>
    `;
    document.getElementById('birthChartContent').innerHTML = birthChartHTML;
    
    // Characteristics
    const sunSign = birthChart.sun_sign.name;
    const characteristics = getCharacteristics(sunSign);
    const charHTML = `
        <div>
            <h4 style="color: #ec4899; margin-bottom: 0.5rem;">Traits</h4>
            <ul>
                ${characteristics.traits.map(t => `<li>${t}</li>`).join('')}
            </ul>
            <h4 style="color: #ec4899; margin: 1rem 0 0.5rem;">Strengths</h4>
            <ul>
                ${characteristics.strengths.map(s => `<li>${s}</li>`).join('')}
            </ul>
            <h4 style="color: #ec4899; margin: 1rem 0 0.5rem;">Weaknesses</h4>
            <ul>
                ${characteristics.weaknesses.map(w => `<li>${w}</li>`).join('')}
            </ul>
            <h4 style="color: #ec4899; margin: 1rem 0 0.5rem;">Compatible Signs</h4>
            <p>${characteristics.compatibility.join(', ')}</p>
        </div>
    `;
    document.getElementById('characteristicsContent').innerHTML = charHTML;
    
    // Current Phase
    const predictions = data.predictions;
    const currentPhaseHTML = `
        <p style="font-size: 1.3rem; color: #06b6d4; margin-bottom: 0.5rem;"><strong>${predictions.current_life_phase}</strong></p>
        <p><strong>Current Age:</strong> ${predictions.current_age} years</p>
    `;
    document.getElementById('currentPhaseContent').innerHTML = currentPhaseHTML;
    
    // Past
    const pastHTML = `
        <p><strong>${predictions.past_prediction.summary}</strong></p>
        <h4 style="color: #ec4899; margin: 1rem 0 0.5rem;">Highlights</h4>
        <ul>
            ${predictions.past_prediction.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
        <h4 style="color: #ec4899; margin: 1rem 0 0.5rem;">Lessons Learned</h4>
        <ul>
            ${predictions.past_prediction.lessons.map(l => `<li>${l}</li>`).join('')}
        </ul>
    `;
    document.getElementById('pastContent').innerHTML = pastHTML;
    
    // Present
    const presentHTML = `
        <p><strong>Current Focus:</strong> ${predictions.present_prediction.current_focus}</p>
        <h4 style="color: #06b6d4; margin: 1rem 0 0.5rem;">Opportunities</h4>
        <ul>
            ${predictions.present_prediction.opportunities.map(o => `<li>${o}</li>`).join('')}
        </ul>
        <h4 style="color: #f59e0b; margin: 1rem 0 0.5rem;">Challenges</h4>
        <ul>
            ${predictions.present_prediction.challenges.map(c => `<li>${c}</li>`).join('')}
        </ul>
    `;
    document.getElementById('presentContent').innerHTML = presentHTML;
    
    // Future
    const futureHTML = `
        <p><strong>Timeframe:</strong> ${predictions.future_prediction.timeframe}</p>
        <h4 style="color: #06b6d4; margin: 1rem 0 0.5rem;">Potential Outcomes</h4>
        <ul>
            ${predictions.future_prediction.potential_outcomes.map(o => `<li>${o}</li>`).join('')}
        </ul>
        <h4 style="color: #06b6d4; margin: 1rem 0 0.5rem;">Recommendations</h4>
        <ul>
            ${predictions.future_prediction.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>
        <p style="margin-top: 1rem; font-style: italic; color: #cbd5e1;">✨ ${predictions.future_prediction.numerology_insight}</p>
    `;
    document.getElementById('futureContent').innerHTML = futureHTML;
    
    // Advice
    const advice = data.advice;
    const adviceHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="padding: 1rem; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; border-radius: 5px;">
                <h4 style="color: #10b981;">💼 Career</h4>
                <p>${advice.career}</p>
            </div>
            <div style="padding: 1rem; background: rgba(236, 72, 153, 0.1); border-left: 3px solid #ec4899; border-radius: 5px;">
                <h4 style="color: #ec4899;">❤️ Relationships</h4>
                <p>${advice.relationships}</p>
            </div>
            <div style="padding: 1rem; background: rgba(59, 130, 246, 0.1); border-left: 3px solid #3b82f6; border-radius: 5px;">
                <h4 style="color: #3b82f6;">🏃 Health</h4>
                <p>${advice.health}</p>
            </div>
            <div style="padding: 1rem; background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; border-radius: 5px;">
                <h4 style="color: #f59e0b;">💰 Finances</h4>
                <p>${advice.finances}</p>
            </div>
            <div style="padding: 1rem; background: rgba(139, 92, 246, 0.1); border-left: 3px solid #8b5cf6; border-radius: 5px;">
                <h4 style="color: #8b5cf6;">🧘 Spiritual</h4>
                <p>${advice.spiritual}</p>
            </div>
            <div style="padding: 1rem; background: rgba(6, 182, 212, 0.1); border-left: 3px solid #06b6d4; border-radius: 5px;">
                <h4 style="color: #06b6d4;">✨ General</h4>
                <p>${advice.general}</p>
            </div>
        </div>
    `;
    document.getElementById('adviceContent').innerHTML = adviceHTML;
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Get zodiac characteristics
function getCharacteristics(sign) {
    const characteristics = {
        "Aries": {
            traits: ["Courageous", "Passionate", "Determined", "Independent"],
            strengths: ["Leadership", "Initiative", "Enthusiasm"],
            weaknesses: ["Impulsivity", "Aggressive", "Impatient"],
            compatibility: ["Leo", "Sagittarius", "Gemini", "Aquarius"]
        },
        "Taurus": {
            traits: ["Reliable", "Patient", "Practical", "Devoted"],
            strengths: ["Stability", "Loyalty", "Determination"],
            weaknesses: ["Stubbornness", "Possessiveness", "Materialism"],
            compatibility: ["Capricorn", "Virgo", "Cancer", "Pisces"]
        },
        "Gemini": {
            traits: ["Curious", "Adaptable", "Outgoing", "Intelligent"],
            strengths: ["Communication", "Versatility", "Mental Agility"],
            weaknesses: ["Inconsistency", "Nervousness", "Superficiality"],
            compatibility: ["Aquarius", "Libra", "Aries", "Leo"]
        },
        "Cancer": {
            traits: ["Emotional", "Intuitive", "Protective", "Loyal"],
            strengths: ["Empathy", "Intuition", "Nurturing"],
            weaknesses: ["Moodiness", "Insecurity", "Manipulation"],
            compatibility: ["Pisces", "Scorpio", "Taurus", "Virgo"]
        },
        "Leo": {
            traits: ["Confident", "Generous", "Warm", "Creative"],
            strengths: ["Leadership", "Confidence", "Creativity"],
            weaknesses: ["Arrogance", "Pride", "Stubbornness"],
            compatibility: ["Sagittarius", "Aries", "Gemini", "Libra"]
        },
        "Virgo": {
            traits: ["Analytical", "Practical", "Modest", "Reliable"],
            strengths: ["Perfection", "Analysis", "Reliability"],
            weaknesses: ["Overthinking", "Criticism", "Worry"],
            compatibility: ["Capricorn", "Taurus", "Cancer", "Scorpio"]
        },
        "Libra": {
            traits: ["Diplomatic", "Fair", "Social", "Artistic"],
            strengths: ["Balance", "Diplomacy", "Artistry"],
            weaknesses: ["Indecision", "Avoidance", "Superficiality"],
            compatibility: ["Aquarius", "Gemini", "Leo", "Sagittarius"]
        },
        "Scorpio": {
            traits: ["Passionate", "Secretive", "Intense", "Determined"],
            strengths: ["Passion", "Intuition", "Power"],
            weaknesses: ["Secretiveness", "Jealousy", "Obsession"],
            compatibility: ["Pisces", "Cancer", "Virgo", "Capricorn"]
        },
        "Sagittarius": {
            traits: ["Optimistic", "Adventurous", "Honest", "Philosophical"],
            strengths: ["Optimism", "Adventure", "Honesty"],
            weaknesses: ["Overconfidence", "Carelessness", "Bluntness"],
            compatibility: ["Aries", "Leo", "Libra", "Aquarius"]
        },
        "Capricorn": {
            traits: ["Ambitious", "Disciplined", "Responsible", "Self-controlled"],
            strengths: ["Discipline", "Responsibility", "Ambition"],
            weaknesses: ["Coldness", "Unforgiving", "Condescending"],
            compatibility: ["Taurus", "Virgo", "Scorpio", "Pisces"]
        },
        "Aquarius": {
            traits: ["Independent", "Intellectual", "Humanitarian", "Progressive"],
            strengths: ["Innovation", "Humanitarianism", "Intellectual"],
            weaknesses: ["Detachment", "Unpredictability", "Stubbornness"],
            compatibility: ["Gemini", "Libra", "Sagittarius", "Aries"]
        },
        "Pisces": {
            traits: ["Compassionate", "Artistic", "Intuitive", "Gentle"],
            strengths: ["Compassion", "Artistry", "Intuition"],
            weaknesses: ["Escapism", "Oversensitivity", "Fearfulness"],
            compatibility: ["Cancer", "Scorpio", "Taurus", "Capricorn"]
        }
    };
    
    return characteristics[sign] || characteristics["Aries"];
}

// Check zodiac compatibility
async function checkCompatibility() {
    const sign1 = document.getElementById('sign1').value;
    const sign2 = document.getElementById('sign2').value;
    
    if (!sign1 || !sign2) {
        alert('Please select both zodiac signs');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/zodiac-compatibility`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sign1, sign2 })
        });
        
        if (!response.ok) {
            throw new Error('Failed to check compatibility');
        }
        
        const data = await response.json();
        displayCompatibilityResult(data);
        
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Error:', error);
    }
}

// Display compatibility result
function displayCompatibilityResult(data) {
    const resultDiv = document.getElementById('compatibilityResult');
    const scorePercent = data.compatibility_score;
    const color = scorePercent >= 80 ? '#10b981' : scorePercent >= 60 ? '#f59e0b' : '#ef4444';
    
    const html = `
        <div style="text-align: center;">
            <h3 style="margin-bottom: 1rem;">${data.sign1} ♥️ ${data.sign2}</h3>
            <div style="font-size: 4rem; margin: 1rem 0;">${scorePercent}%</div>
            <div style="width: 100%; height: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; margin: 1rem 0;">
                <div style="width: ${scorePercent}%; height: 100%; background: ${color}; transition: width 0.3s;"></div>
            </div>
            <p style="font-size: 1.1rem; margin-top: 1rem; color: var(--text-muted);">${data.description}</p>
            <p style="margin-top: 1rem; font-weight: bold; color: var(--text-color);">
                ${data.compatible ? '✨ These signs have great potential together!' : '💫 These signs can work well with understanding and effort.'}
            </p>
        </div>
    `;
    
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

// Close results
function closeResults() {
    document.getElementById('results').style.display = 'none';
}

// New prediction
function newPrediction() {
    document.getElementById('predictionForm').reset();
    document.getElementById('results').style.display = 'none';
    window.scrollTo(0, 0);
}

// Print results
function printResults() {
    window.print();
}

// Download results as text
function downloadResults() {
    if (!currentPredictionData) {
        alert('No prediction data to download');
        return;
    }
    
    const data = currentPredictionData;
    const text = generateTextReport(data);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `astrology_report_${data.birth_chart.name}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Generate text report
function generateTextReport(data) {
    const birth = data.birth_chart;
    const pred = data.predictions;
    const advice = data.advice;
    
    let report = `
╔════════════════════════════════════════════════════════════════╗
║             ASTROLOGICAL REPORT - AstroPredict                  ║
╚════════════════════════════════════════════════════════════════╝

PERSONAL INFORMATION
────────────────────────────────────────────────────────────────
Name: ${birth.name}
Date of Birth: ${birth.birth_date}
Gender: ${birth.gender}
Birth Location: Latitude ${birth.location.latitude}, Longitude ${birth.location.longitude}

BIRTH CHART ANALYSIS
────────────────────────────────────────────────────────────────
Sun Sign: ${birth.sun_sign.name} ${birth.sun_sign.symbol}
Element: ${birth.element}
Life Path Number: ${birth.life_path_number}

LIFE JOURNEY
────────────────────────────────────────────────────────────────
Current Age: ${pred.current_age} years
Current Life Phase: ${pred.current_life_phase}

PAST PREDICTIONS (Birth to Now)
────────────────────────────────────────────────────────────────
${pred.past_prediction.summary}

Highlights:
${pred.past_prediction.highlights.map(h => `• ${h}`).join('\n')}

Lessons Learned:
${pred.past_prediction.lessons.map(l => `• ${l}`).join('\n')}

PRESENT INSIGHTS
────────────────────────────────────────────────────────────────
Current Focus: ${pred.present_prediction.current_focus}

Opportunities:
${pred.present_prediction.opportunities.map(o => `• ${o}`).join('\n')}

Challenges:
${pred.present_prediction.challenges.map(c => `• ${c}`).join('\n')}

FUTURE PREDICTIONS
────────────────────────────────────────────────────────────────
Timeframe: ${pred.future_prediction.timeframe}

Potential Outcomes:
${pred.future_prediction.potential_outcomes.map(o => `• ${o}`).join('\n')}

Recommendations:
${pred.future_prediction.recommendations.map(r => `• ${r}`).join('\n')}

Numerology Insight: ${pred.future_prediction.numerology_insight}

PERSONALIZED ADVICE
────────────────────────────────────────────────────────────────
Career: ${advice.career}
Relationships: ${advice.relationships}
Health: ${advice.health}
Finances: ${advice.finances}
Spiritual: ${advice.spiritual}
General: ${advice.general}

════════════════════════════════════════════════════════════════
Generated: ${new Date().toLocaleString()}
Visit: https://astropredict.com
════════════════════════════════════════════════════════════════
    `;
    
    return report;
}

// Share results
function shareResults() {
    if (!currentPredictionData) {
        alert('No prediction data to share');
        return;
    }
    
    const name = currentPredictionData.birth_chart.name;
    const sign = currentPredictionData.birth_chart.sun_sign.name;
    const text = `I just discovered my astrological profile on AstroPredict! My sun sign is ${sign}. Check out your cosmic destiny: https://astropredict.com`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Astrological Profile',
            text: text
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

// Show/hide loading spinner
function showSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.style.display = 'flex';
    } else {
        spinner.style.display = 'none';
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});
