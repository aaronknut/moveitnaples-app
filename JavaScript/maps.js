function calculateDriveDistance() {
  const origin = document.getElementById('originAddress').value;
  const destination = document.getElementById('destinationAddress').value;
  const homeBase = document.getElementById('homeBaseAddress').value || "16525 Bonita Landing Circle, Bonita Springs, FL 34135";

  if (!origin || !destination) {
    alert('Please enter both origin and destination addresses.');
    return;
  }

  const waypointInputs = document.querySelectorAll('.waypoint input');
  const waypoints = Array.from(waypointInputs)
    .map(input => input.value.trim())
    .filter(value => value !== '')
    .map(address => ({ location: address, stopover: true }));

  const map = new google.maps.Map(document.getElementById("mapPreview"), {
    zoom: 7,
    center: { lat: 26.142, lng: -81.794 },
  });

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Step 1: Outbound
  directionsService.route(
    {
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (outboundResponse, outboundStatus) => {
      if (outboundStatus !== "OK") {
        console.error("Outbound route failed:", outboundStatus);
        return;
      }

      directionsRenderer.setDirections(outboundResponse);

      let totalDistance = 0;
      let totalDuration = 0;

      outboundResponse.routes[0].legs.forEach(leg => {
        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;
      });

      const outboundMiles = totalDistance / 1609.34;
      const outboundHours = totalDuration / 3600;

      // Step 2: Return to Home Base
      directionsService.route(
        {
          origin: destination,
          destination: homeBase,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (returnResponse, returnStatus) => {
          if (returnStatus !== "OK") {
            console.error("Return route failed:", returnStatus);
            return;
          }

          const returnLeg = returnResponse.routes[0].legs[0];
          const returnMiles = returnLeg.distance.value / 1609.34;
          const returnHours = returnLeg.duration.value / 3600;

          const totalDriveMiles = outboundMiles + returnMiles;
          const totalDriveHours = outboundHours + returnHours;

          document.getElementById('driveMiles').value = totalDriveMiles.toFixed(1);
          document.getElementById('driveTime').textContent = totalDriveHours.toFixed(2);

          updateSummary();
        }
      );
    }
  );
}

function initializeAutocomplete() {
  const originInput = document.getElementById('originAddress');
  const destinationInput = document.getElementById('destinationAddress');
  const homeBaseInput = document.getElementById('homeBaseAddress');

  if (originInput) new google.maps.places.Autocomplete(originInput);
  if (destinationInput) new google.maps.places.Autocomplete(destinationInput);
  if (homeBaseInput) new google.maps.places.Autocomplete(homeBaseInput);

  document.querySelectorAll('.waypoint input').forEach(input => {
    new google.maps.places.Autocomplete(input);
  });
}

function addWaypoint() {
  const container = document.getElementById('waypointsContainer');

  const wrapper = document.createElement('div');
  wrapper.className = 'waypoint';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.marginTop = '8px';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Stop address';
  input.style.flex = '1';
  input.style.marginRight = '8px';

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.type = 'button';
  removeBtn.onclick = () => wrapper.remove();

  wrapper.appendChild(input);
  wrapper.appendChild(removeBtn);
  container.appendChild(wrapper);

  // Add autocomplete to new stop
  if (typeof google !== 'undefined' && google.maps?.places) {
    new google.maps.places.Autocomplete(input);
  }

  initializeSortable();
}


function initializeSortable() {
  const container = document.getElementById('waypointsContainer');
  if (window.Sortable) {
    Sortable.create(container, {
      animation: 150,
      handle: '.waypoint',
    });
  }
}