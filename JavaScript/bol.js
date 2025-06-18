function handleGenerateBillOfLading() {
  const customerName = document.getElementById('customerName').value;
  const customerEmail = document.getElementById('customerEmail').value;
  const customerPhone = document.getElementById('customerPhone').value;
  const moveDate = new Date().toLocaleDateString();
  const origin = document.getElementById('originAddress').value;
  const destination = document.getElementById('destinationAddress').value;
  const totalWeight = document.getElementById('totalWeight').textContent;
  const totalCuft = document.getElementById('totalCuft').textContent;
  const crewSize = document.getElementById('crewSize').value;
  const laborHours = document.getElementById('laborHours').textContent;
  const driveTime = document.getElementById('driveTime').textContent;

  let inventoryRows = "";
  document.querySelectorAll("#inventoryBody tr").forEach(row => {
    const cells = row.querySelectorAll("td");

    // Only include rows with full data (room, item, qty, weight, cuft)
    if (cells.length >= 5) {
      const room = cells[0].querySelector('select')?.value || '';
      const itemSelect = cells[1].querySelector('.item-select');
      const item = itemSelect?.tomselect?.getValue() || '';
      const qty = cells[2].querySelector('input')?.value || '';
      const weight = cells[3].textContent || '';
      const cuft = cells[4].textContent || '';

      inventoryRows += `
        <tr>
          <td>${room}</td>
          <td>${item}</td>
          <td>${qty}</td>
          <td>${weight}</td>
          <td>${cuft}</td>
        </tr>
      `;
    }
  });

  // Add blank rows for flexibility
  for (let i = 0; i < 3; i++) {
    inventoryRows += `
      <tr>
        <td style="height: 30px;"></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    `;
  }

  const billWindow = window.open('', 'BOL', 'height=700,width=900');
  billWindow.document.write(`
    <html>
      <head>
        <title>Bill of Lading</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>Bill of Lading</h1>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        <p><strong>Date:</strong> ${moveDate}</p>
        <p><strong>Origin:</strong> ${origin}</p>
        <p><strong>Destination:</strong> ${destination}</p>
        <p><strong>Crew Size:</strong> ${crewSize}</p>
        <p><strong>Estimated Labor Hours:</strong> ${laborHours}</p>
        <p><strong>Estimated Drive Time:</strong> ${driveTime}</p>
        <p><strong>Total Weight:</strong> ${totalWeight} lbs</p>
        <p><strong>Total Volume:</strong> ${totalCuft} cuft</p>

        <p><strong>Start Time:</strong> ____________________</p>
        <p><strong>End Time:</strong> ______________________</p>

        <h2>Inventory</h2>
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Weight</th>
              <th>Cuft</th>
            </tr>
          </thead>
          <tbody>
            ${inventoryRows}
          </tbody>
        </table>

        <p style="margin-top: 40px;">Customer Signature: __________________________</p>
        <p>Company Rep Signature: ________________________</p>
        <p>Date: ____________________</p>
      </body>
    </html>
  `);
  billWindow.document.close();
  billWindow.print();
}