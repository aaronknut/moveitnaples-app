  document.getElementById('totalWeight').textContent = totalWeight;
  document.getElementById('totalCuft').textContent = totalCuft;

  const flights = parseInt(document.getElementById('flights').value) || 0;
  const elevator = document.getElementById('elevator').checked ? 0 : 0.5;
  const distanceToTruck = parseFloat(document.getElementById('distanceToTruck').value) || 0;
  const driveMiles = parseFloat(document.getElementById('driveMiles').value) || 0;
  const crewSize = parseInt(document.getElementById('crewSize').value) || 1;

  const baseLabor = (totalWeight / 1000) + (totalCuft / 300);
  const laborModifiers = (flights * 0.5) + elevator + (distanceToTruck / 100);
  const totalLabor = baseLabor + laborModifiers;
  const laborHours = (totalLabor / crewSize).toFixed(1);
  const driveTime = (driveMiles / 30).toFixed(1); // 30 mph average

  document.getElementById('laborHours').textContent = laborHours;
  document.getElementById('driveTime').textContent = driveTime;

  const truck = totalCuft <= 500 ? 'Small (10\')' :
                totalCuft <= 800 ? 'Medium (15\')' :
                totalCuft <= 1200 ? 'Large (20\')' :
                totalCuft <= 1600 ? 'XL (26\')' : 'Tractor Trailer';
  document.getElementById('truckRecommendation').textContent = truck;