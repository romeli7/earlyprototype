// Comprehensive Morocco Phosphate Industry Visualization v2.0
// Evidence-based partner countries from UN Comtrade/WITS/OEC data

// Global variables
let map;
let sitesLayer;
let flowsLayer;
let currentProductMode = 'bulk';
let currentStoryStep = 0;
let highlightedLayer = null;

// Site data including southern Morocco coverage
const SITES = {
    "type": "FeatureCollection",
    "features": [
        // Northern Morocco sites
        {
            "type": "Feature",
            "properties": {
                "id": "khouribga",
                "name": "Khouribga",
                "type": "mine",
                "stage": "extraction",
                "operator": "OCP Group",
                "region": "northern",
                "note": "World's largest phosphate mining basin; core upstream node in Morocco's phosphate chain."
            },
            "geometry": { "type": "Point", "coordinates": [-6.9063, 32.8811] }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "benguerir",
                "name": "Benguerir (Gantour)",
                "type": "mine",
                "stage": "extraction",
                "operator": "OCP Group",
                "region": "northern",
                "note": "Mining site in Gantour basin; feeds downstream processing."
            },
            "geometry": { "type": "Point", "coordinates": [-7.95397, 32.24088] }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "youssoufia",
                "name": "Youssoufia (Gantour)",
                "type": "mine",
                "stage": "extraction",
                "operator": "OCP Group",
                "region": "northern",
                "note": "Mining town associated with phosphate extraction in the Gantour basin."
            },
            "geometry": { "type": "Point", "coordinates": [-8.52941, 32.2463] }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "jorf_lasfar_port",
                "name": "Jorf Lasfar (Port & Chemical Platform)",
                "type": "chemical_hub",
                "stage": "bulk_fertilizer",
                "operator": "OCP Group",
                "region": "northern",
                "note": "Major coastal industrial platform connected to Khouribga by slurry pipeline; bulk transformation + exports."
            },
            "geometry": { "type": "Point", "coordinates": [-8.62028, 33.1267] }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "safi",
                "name": "Safi (Chemical Platform)",
                "type": "chemical_hub",
                "stage": "bulk_fertilizer",
                "operator": "OCP Group",
                "region": "northern",
                "note": "Coastal processing hub associated with chemical production and fertilizer output."
            },
            "geometry": { "type": "Point", "coordinates": [-9.23718, 32.29939] }
        },
        // Southern Morocco sites (Western Sahara region)
        {
            "type": "Feature",
            "properties": {
                "id": "bou_craa",
                "name": "Bou Craa",
                "type": "mine",
                "stage": "extraction",
                "operator": "Phosboucraa (OCP Group)",
                "region": "southern",
                "note": "Major phosphate mining operation in southern regions; part of disputed Western Sahara territory."
            },
            "geometry": { "type": "Point", "coordinates": [-13.0, 26.0] }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "laayoune",
                "name": "Laâyoune (Logistics Hub)",
                "type": "logistics",
                "stage": "processing",
                "operator": "Phosboucraa (OCP Group)",
                "region": "southern",
                "note": "Industrial and logistics node connecting southern mines to export chains."
            },
            "geometry": { "type": "Point", "coordinates": [-15.0, 27.0] }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "laayoune_export",
                "name": "Laâyoune Export Point",
                "type": "logistics",
                "stage": "export",
                "operator": "Phosboucraa (OCP Group)",
                "region": "southern",
                "note": "Export terminal for southern phosphate production."
            },
            "geometry": { "type": "Point", "coordinates": [-17.0, 27.5] }
        }
    ]
};

// Export partner countries by product mode (evidence-based from WITS/OEC)
const EXPORT_PARTNERS = {
    bulk: [
        { id: "brazil", name: "Brazil", coords: [-55.0, -10.0], hs_code: "3105", role: "Major fertilizer importer" },
        { id: "argentina", name: "Argentina", coords: [-64.0, -38.0], hs_code: "3105", role: "Agricultural market" },
        { id: "mexico", name: "Mexico", coords: [-102.0, 23.0], hs_code: "3105", role: "Key fertilizer market" },
        { id: "colombia", name: "Colombia", coords: [-74.0, 4.0], hs_code: "3105", role: "Agricultural sector" },
        { id: "peru", name: "Peru", coords: [-75.0, -9.0], hs_code: "3105", role: "Mining/agriculture" },
        { id: "india", name: "India", coords: [77.0, 20.0], hs_code: "310540", role: "World's largest fertilizer importer" },
        { id: "bangladesh", name: "Bangladesh", coords: [90.0, 24.0], hs_code: "3105", role: "Major agricultural market" },
        { id: "pakistan", name: "Pakistan", coords: [69.0, 30.0], hs_code: "3105", role: "Agricultural sector" },
        { id: "china", name: "China", coords: [105.0, 35.0], hs_code: "3105", role: "Large fertilizer market" },
        { id: "indonesia", name: "Indonesia", coords: [113.0, -8.0], hs_code: "3105", role: "Palm oil agriculture" },
        { id: "vietnam", name: "Vietnam", coords: [108.0, 14.0], hs_code: "3105", role: "Rice agriculture" },
        { id: "spain", name: "Spain", coords: [-3.0, 40.0], hs_code: "3105", role: "EU agricultural market" },
        { id: "france", name: "France", coords: [2.0, 46.0], hs_code: "3105", role: "EU agricultural sector" },
        { id: "italy", name: "Italy", coords: [12.0, 42.0], hs_code: "3105", role: "Mediterranean agriculture" },
        { id: "netherlands", name: "Netherlands", coords: [5.0, 52.0], hs_code: "3105", role: "EU distribution hub" },
        { id: "uk", name: "United Kingdom", coords: [0.0, 54.0], hs_code: "3105", role: "Agricultural sector" },
        { id: "ethiopia", name: "Ethiopia", coords: [40.0, 9.0], hs_code: "3105", role: "Growing agricultural market" },
        { id: "kenya", name: "Kenya", coords: [38.0, 1.0], hs_code: "3105", role: "Agricultural sector" },
        { id: "ghana", name: "Ghana", coords: [-2.0, 8.0], hs_code: "3105", role: "Agricultural market" },
        { id: "nigeria", name: "Nigeria", coords: [8.0, 10.0], hs_code: "3105", role: "Large agricultural sector" },
        { id: "south_africa", name: "South Africa", coords: [25.0, -29.0], hs_code: "3105", role: "Agricultural sector" }
    ],
    chemicals: [
        { id: "spain", name: "Spain", coords: [-3.0, 40.0], hs_code: "2835", role: "Chemical industry" },
        { id: "france", name: "France", coords: [2.0, 46.0], hs_code: "2835", role: "Chemical manufacturing" },
        { id: "belgium", name: "Belgium", coords: [4.0, 51.0], hs_code: "2835", role: "Chemical hub" },
        { id: "netherlands", name: "Netherlands", coords: [5.0, 52.0], hs_code: "2835", role: "Chemical distribution" },
        { id: "usa", name: "United States", coords: [-100.0, 40.0], hs_code: "2835", role: "Chemical industry" },
        { id: "brazil", name: "Brazil", coords: [-55.0, -10.0], hs_code: "2835", role: "Chemical sector" },
        { id: "mexico", name: "Mexico", coords: [-102.0, 23.0], hs_code: "2835", role: "Chemical manufacturing" }
    ]
};

// Import origin countries (specialty derivatives)
const IMPORT_ORIGINS = [
    { id: "china", name: "China", coords: [105.0, 35.0], hs_code: "283524", role: "Advanced chemical manufacturing" },
    { id: "japan", name: "Japan", coords: [138.0, 36.0], hs_code: "283524", role: "Specialty chemical production" },
    { id: "south_korea", name: "South Korea", coords: [128.0, 36.0], hs_code: "283524", role: "Advanced chemical industry" },
    { id: "germany", name: "Germany", coords: [10.0, 51.0], hs_code: "283524", role: "Chemical engineering hub" },
    { id: "belgium", name: "Belgium", coords: [4.0, 51.0], hs_code: "283524", role: "Chemical processing" },
    { id: "netherlands", name: "Netherlands", coords: [5.0, 52.0], hs_code: "283524", role: "Chemical distribution" },
    { id: "france", name: "France", coords: [2.0, 46.0], hs_code: "283524", role: "Specialty chemicals" },
    { id: "spain", name: "Spain", coords: [-3.0, 40.0], hs_code: "283524", role: "Chemical manufacturing" },
    { id: "israel", name: "Israel", coords: [35.0, 31.0], hs_code: "283524", role: "Chemical technology" },
    { id: "usa", name: "United States", coords: [-100.0, 40.0], hs_code: "283524", role: "Advanced chemical industry" }
];

// Stage definitions
const STAGES = {
    "stages": [
        {
            "key": "extraction",
            "label": "Extraction (phosphate rock)",
            "definition": "Fully local: mining and extraction in Morocco."
        },
        {
            "key": "processing",
            "label": "Processing & Logistics",
            "definition": "Local processing and transport infrastructure."
        },
        {
            "key": "bulk_fertilizer",
            "label": "Bulk fertilizers",
            "definition": "Local large-scale industrial production; major exports."
        },
        {
            "key": "specialty_partial",
            "label": "Specialty phosphate derivatives",
            "definition": "Partially local: many high-value downstream derivatives are produced abroad and can re-enter as imports (value leakage)."
        }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    loadLayers();
    setupControls();
    setupLegend();
    setupProfilePanel();
    setupStoryMode();
    setupProductMode();
    setupSourcesToggle();
});

// Initialize Leaflet map
function initializeMap() {
    map = L.map('map').setView([25.0, 0.0], 3);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
}

// Create curved path between two points
function createCurvedPath(from, to, options = {}) {
    const fromLatLng = L.latLng(from[1], from[0]);
    const toLatLng = L.latLng(to[1], to[0]);
    
    // Calculate midpoint and offset for curve
    const midLat = (fromLatLng.lat + toLatLng.lat) / 2;
    const midLng = (fromLatLng.lng + toLatLng.lng) / 2;
    
    // Calculate perpendicular offset for curve
    const latDiff = toLatLng.lat - fromLatLng.lat;
    const lngDiff = toLatLng.lng - fromLatLng.lng;
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    
    // Offset magnitude based on distance
    const offsetMagnitude = distance * 0.15;
    
    // Calculate perpendicular offset
    const perpLat = -lngDiff / distance * offsetMagnitude;
    const perpLng = latDiff / distance * offsetMagnitude;
    
    const controlPoint = [midLat + perpLat, midLng + perpLng];
    
    // Generate curved path points
    const points = [];
    const steps = 60;
    
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = Math.pow(1-t, 2) * fromLatLng.lat + 
                   2 * (1-t) * t * controlPoint[0] + 
                   Math.pow(t, 2) * toLatLng.lat;
        const lng = Math.pow(1-t, 2) * fromLatLng.lng + 
                   2 * (1-t) * t * controlPoint[1] + 
                   Math.pow(t, 2) * toLatLng.lng;
        points.push([lat, lng]);
    }
    
    return L.polyline(points, {
        ...options,
        smoothFactor: 1
    });
}

// Load and create layers
function loadLayers() {
    // Create sites layer
    sitesLayer = L.layerGroup().addTo(map);
    
    SITES.features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const props = feature.properties;
        
        const marker = L.circleMarker([coords[1], coords[0]], {
            radius: getMarkerSize(props.type),
            fillColor: getMarkerColor(props.type),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });
        
        // Add tooltip
        marker.bindTooltip(createSiteTooltip(props), {
            permanent: false,
            sticky: true,
            direction: 'top'
        });
        
        // Add hover effects
        marker.on('mouseover', function() {
            highlightSite(marker, feature);
        });
        
        marker.on('mouseout', function() {
            resetHighlight();
        });
        
        // Add click for profile
        marker.on('click', function() {
            showProfileCard(feature);
        });
        
        marker.feature = feature;
        sitesLayer.addLayer(marker);
    });
    
    // Create flows layer
    flowsLayer = L.layerGroup().addTo(map);
    updateFlows();
}

// Update flows based on current product mode
function updateFlows() {
    flowsLayer.clearLayers();
    
    // Domestic flows (always visible)
    addDomesticFlows();
    
    // Export flows based on product mode
    if (currentProductMode === 'bulk' || currentProductMode === 'chemicals') {
        addExportFlows();
    }
    
    // Import flows (specialty mode)
    if (currentProductMode === 'specialty') {
        addImportFlows();
    }
}

// Add domestic flows
function addDomesticFlows() {
    const domesticFlows = [
        { from: [-6.9063, 32.8811], to: [-8.62028, 33.1267], label: "Khouribga → Jorf Lasfar (Slurry pipeline)" },
        { from: [-13.0, 26.0], to: [-15.0, 27.0], label: "Bou Craa → Laâyoune (Logistics corridor)" }
    ];
    
    domesticFlows.forEach(flow => {
        const curve = createCurvedPath(flow.from, flow.to, {
            color: '#6b7280',
            weight: 2,
            opacity: 0.8,
            dashArray: null
        });
        
        curve.bindTooltip(flow.label, {
            permanent: false,
            sticky: true,
            direction: 'center'
        });
        
        flowsLayer.addLayer(curve);
    });
}

// Add export flows based on product mode
function addExportFlows() {
    const partners = EXPORT_PARTNERS[currentProductMode] || [];
    const moroccanHubs = [
        { coords: [-8.62028, 33.1267], name: "Jorf Lasfar" },
        { coords: [-9.23718, 32.29939], name: "Safi" }
    ];
    
    partners.forEach(partner => {
        // Connect to nearest Moroccan hub
        const hub = moroccanHubs[Math.floor(Math.random() * moroccanHubs.length)];
        
        const curve = createCurvedPath(hub.coords, partner.coords, {
            color: '#059669',
            weight: 3,
            opacity: 0.7,
            dashArray: null
        });
        
        const tooltip = `${hub.name} → ${partner.name} (${partner.hs_code})`;
        curve.bindTooltip(tooltip, {
            permanent: false,
            sticky: true,
            direction: 'center'
        });
        
        flowsLayer.addLayer(curve);
    });
}

// Add import flows
function addImportFlows() {
    const moroccoPoint = [-8.62028, 33.1267]; // Jorf Lasfar as entry point
    
    IMPORT_ORIGINS.forEach(origin => {
        const curve = createCurvedPath(origin.coords, moroccoPoint, {
            color: '#7c3aed',
            weight: 3,
            opacity: 0.8,
            dashArray: '8,4'
        });
        
        const tooltip = `${origin.name} → Morocco (${origin.hs_code})`;
        curve.bindTooltip(tooltip, {
            permanent: false,
            sticky: true,
            direction: 'center'
        });
        
        flowsLayer.addLayer(curve);
    });
}

// Get marker size based on type
function getMarkerSize(type) {
    const sizes = {
        'mine': 8,
        'chemical_hub': 10,
        'logistics': 6,
        'anchor': 7
    };
    return sizes[type] || 6;
}

// Get marker color based on type
function getMarkerColor(type) {
    const colors = {
        'mine': '#8B4513',
        'chemical_hub': '#2563eb',
        'logistics': '#f59e0b',
        'anchor': '#dc2626'
    };
    return colors[type] || '#666';
}

// Create tooltip for sites
function createSiteTooltip(properties) {
    let content = `<strong>${properties.name}</strong>`;
    content += `<span>Type: ${properties.type}</span>`;
    content += `<span>Stage: ${properties.stage}</span>`;
    if (properties.operator) {
        content += `<span>Operator: ${properties.operator}</span>`;
    }
    content += `<span>${properties.note}</span>`;
    return content;
}

// Highlight site on hover
function highlightSite(marker, feature) {
    resetHighlight();
    
    marker.setStyle({
        radius: getMarkerSize(feature.properties.type) * 1.5,
        weight: 3,
        fillOpacity: 1
    });
    
    highlightedLayer = marker;
}

// Reset highlight
function resetHighlight() {
    if (highlightedLayer) {
        const feature = highlightedLayer.feature;
        highlightedLayer.setStyle({
            radius: getMarkerSize(feature.properties.type),
            weight: 2,
            fillOpacity: 0.8
        });
        highlightedLayer = null;
    }
}

// Setup controls
function setupControls() {
    const showSites = document.getElementById('showSites');
    const showFlows = document.getElementById('showFlows');
    const transformationCeiling = document.getElementById('transformationCeiling');
    
    showSites.addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(sitesLayer);
        } else {
            map.removeLayer(sitesLayer);
        }
    });
    
    showFlows.addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(flowsLayer);
        } else {
            map.removeLayer(flowsLayer);
        }
    });
    
    transformationCeiling.addEventListener('change', function() {
        if (this.checked) {
            applyTransformationCeiling();
        } else {
            resetTransformationCeiling();
        }
    });
}

// Setup legend
function setupLegend() {
    const stageDefinitions = document.getElementById('stageDefinitions');
    STAGES.stages.forEach(stage => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${stage.label}</strong>${stage.definition}`;
        stageDefinitions.appendChild(div);
    });
}

// Setup profile panel
function setupProfilePanel() {
    const closeBtn = document.getElementById('closeProfile');
    const profilePanel = document.getElementById('profilePanel');
    
    closeBtn.addEventListener('click', function() {
        profilePanel.style.display = 'none';
    });
}

// Show profile card for a site
function showProfileCard(feature) {
    const profilePanel = document.getElementById('profilePanel');
    const profileContent = document.getElementById('profileContent');
    const props = feature.properties;
    
    let content = `<h3>${props.name}</h3>`;
    content += `<p><strong>Type:</strong> ${props.type}</p>`;
    content += `<p><strong>Stage:</strong> ${props.stage}</p>`;
    content += `<p><strong>Operator:</strong> ${props.operator}</p>`;
    content += `<p><strong>Region:</strong> ${props.region}</p>`;
    content += `<p><strong>Note:</strong> ${props.note}</p>`;
    
    // Add capability ladder
    content += '<div class="capability-ladder">';
    content += '<h4>Capability Ladder</h4>';
    
    const ladderOrder = ['extraction', 'processing', 'bulk_fertilizer', 'specialty_partial'];
    ladderOrder.forEach(stageKey => {
        const stage = STAGES.stages.find(s => s.key === stageKey);
        if (stage) {
            const isActive = props.stage === stageKey;
            const className = isActive ? 'ladder-step active' : 'ladder-step';
            content += `<div class="${className}"><span>${stage.label}</span></div>`;
        }
    });
    
    content += '</div>';
    
    // Add "Why this matters"
    content += '<div class="why-matters">';
    content += '<h4>Why This Matters</h4>';
    if (props.stage === 'extraction') {
        content += '<p>This is where value creation begins - raw phosphate extraction provides the foundation for the entire value chain.</p>';
    } else if (props.stage === 'bulk_fertilizer') {
        content += '<p>This represents Morocco\'s industrial capability - transforming raw materials into export-ready bulk products.</p>';
    } else if (props.stage === 'specialty_partial') {
        content += '<p>This shows the transformation ceiling - where Morocco\'s value creation stops and value leakage begins.</p>';
    }
    content += '</div>';
    
    profileContent.innerHTML = content;
    profilePanel.style.display = 'block';
}

// Setup story mode
function setupStoryMode() {
    const storyBtn = document.getElementById('storyMode');
    const closeStory = document.getElementById('closeStory');
    const storyPanel = document.getElementById('storyPanel');
    const prevStep = document.getElementById('prevStep');
    const nextStep = document.getElementById('nextStep');
    
    storyBtn.addEventListener('click', function() {
        storyPanel.style.display = 'block';
        currentStoryStep = 1;
        updateStoryStep();
    });
    
    closeStory.addEventListener('click', function() {
        storyPanel.style.display = 'none';
    });
    
    prevStep.addEventListener('click', function() {
        if (currentStoryStep > 1) {
            currentStoryStep--;
            updateStoryStep();
        }
    });
    
    nextStep.addEventListener('click', function() {
        if (currentStoryStep < 5) {
            currentStoryStep++;
            updateStoryStep();
        }
    });
}

// Update story step
function updateStoryStep() {
    const stepIndicator = document.getElementById('stepIndicator');
    const storySteps = document.querySelectorAll('.story-step');
    
    stepIndicator.textContent = `Step ${currentStoryStep}/5`;
    
    storySteps.forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStoryStep);
    });
    
    // Update map view and highlights based on step
    switch(currentStoryStep) {
        case 1:
            // Extraction basins
            map.setView([28.0, -10.0], 5);
            highlightExtractionSites();
            break;
        case 2:
            // Domestic logistics
            map.setView([30.0, -10.0], 5);
            highlightLogisticsSites();
            break;
        case 3:
            // Coastal hubs
            map.setView([32.5, -9.0], 6);
            highlightCoastalHubs();
            break;
        case 4:
            // Global exports
            map.setView([25.0, 0.0], 3);
            highlightExportFlows();
            break;
        case 5:
            // Transformation ceiling
            map.setView([25.0, 0.0], 3);
            applyTransformationCeiling();
            break;
    }
}

// Story mode highlighting functions
function highlightExtractionSites() {
    // Implementation for highlighting extraction sites
}

function highlightLogisticsSites() {
    // Implementation for highlighting logistics
}

function highlightCoastalHubs() {
    // Implementation for highlighting coastal hubs
}

function highlightExportFlows() {
    // Implementation for highlighting export flows
}

// Setup product mode selector
function setupProductMode() {
    const productSelector = document.getElementById('productSelector');
    
    productSelector.addEventListener('change', function() {
        currentProductMode = this.value;
        updateFlows();
        updateLegend();
    });
}

// Update legend based on product mode
function updateLegend() {
    // Implementation for updating legend
}

// Setup sources toggle
function setupSourcesToggle() {
    const sourcesToggle = document.getElementById('sourcesToggle');
    const sourcesPanel = document.getElementById('sourcesPanel');
    const closeSources = document.getElementById('closeSources');
    
    sourcesToggle.addEventListener('click', function() {
        const isVisible = sourcesPanel.style.display !== 'none';
        sourcesPanel.style.display = isVisible ? 'none' : 'block';
        sourcesToggle.classList.toggle('active', !isVisible);
    });
    
    closeSources.addEventListener('click', function() {
        sourcesPanel.style.display = 'none';
        sourcesToggle.classList.remove('active');
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!sourcesToggle.contains(event.target) && !sourcesPanel.contains(event.target)) {
            sourcesPanel.style.display = 'none';
            sourcesToggle.classList.remove('active');
        }
    });
}

// Transformation ceiling mode
function applyTransformationCeiling() {
    // Dim all sites first
    sitesLayer.eachLayer(function(layer) {
        layer.setStyle({ opacity: 0.3, fillOpacity: 0.3 });
        if (layer._path) {
            layer._path.classList.add('dimmed');
        }
    });
    
    // Highlight Moroccan extraction + bulk fertilizer sites
    sitesLayer.eachLayer(function(layer) {
        const feature = layer.feature;
        const stage = feature.properties.stage;
        const type = feature.properties.type;
        // Highlight Moroccan sites (extraction, bulk_fertilizer)
        if ((stage === 'extraction' || stage === 'bulk_fertilizer') && 
            (type === 'mine' || type === 'chemical_hub')) {
            layer.setStyle({ opacity: 1, fillOpacity: 0.8 });
            if (layer._path) {
                layer._path.classList.remove('dimmed');
                layer._path.classList.add('highlighted');
            }
        }
        // Highlight logistics nodes
        if (type === 'logistics') {
            layer.setStyle({ opacity: 0.8, fillOpacity: 0.6 });
            if (layer._path) {
                layer._path.classList.remove('dimmed');
                layer._path.classList.add('highlighted');
            }
        }
    });
    
    // Dim all flows
    flowsLayer.eachLayer(function(layer) {
        layer.setStyle({ opacity: 0.2 });
        if (layer._path) {
            layer._path.classList.add('dimmed');
        }
    });
    
    // Keep domestic flows visible (shows internal integration)
    flowsLayer.eachLayer(function(layer) {
        const tooltip = layer.getTooltip();
        if (tooltip && tooltip.getContent().includes('Domestic')) {
            layer.setStyle({ opacity: 0.8 });
            if (layer._path) {
                layer._path.classList.remove('dimmed');
                layer._path.classList.add('highlighted');
            }
        }
    });
    
    // Highlight ALL import flows (specialty derivatives returning to Morocco)
    flowsLayer.eachLayer(function(layer) {
        const tooltip = layer.getTooltip();
        if (tooltip && tooltip.getContent().includes('→ Morocco')) {
            layer.setStyle({ opacity: 1, weight: 4 });
            if (layer._path) {
                layer._path.classList.remove('dimmed');
                layer._path.classList.add('highlighted');
            }
        }
    });
}

// Reset transformation ceiling mode
function resetTransformationCeiling() {
    // Reset all sites
    sitesLayer.eachLayer(function(layer) {
        const feature = layer.feature;
        const color = getMarkerColor(feature.properties.type);
        layer.setStyle({ 
            opacity: 1, 
            fillOpacity: 0.8,
            color: '#fff',
            weight: 2
        });
        if (layer._path) {
            layer._path.classList.remove('dimmed', 'highlighted');
        }
    });
    
    // Reset all flows
    flowsLayer.eachLayer(function(layer) {
        // Reset to original flow styles based on current product mode
        const tooltip = layer.getTooltip();
        if (tooltip) {
            const content = tooltip.getContent();
            if (content.includes('Domestic')) {
                layer.setStyle({ color: '#6b7280', weight: 2, opacity: 0.8, dashArray: null });
            } else if (content.includes('→ Morocco')) {
                layer.setStyle({ color: '#7c3aed', weight: 3, opacity: 0.8, dashArray: '8,4' });
            } else {
                layer.setStyle({ color: '#059669', weight: 3, opacity: 0.7, dashArray: null });
            }
        }
        if (layer._path) {
            layer._path.classList.remove('dimmed', 'highlighted');
        }
    });
}
