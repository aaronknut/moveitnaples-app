let inventoryList = [];

fetch('move_inventory_master.json')
  .then(response => response.json())
  .then(data => {
    inventoryList = data;
    addRow();
  })
  .catch(error => {
    console.error("Failed to load inventory list:", error);
  });

function addRow() {
  const tbody = document.getElementById('inventoryBody');
  const tr = document.createElement('tr');

  // Room cell
  const roomCell = document.createElement('td');
  const roomSelect = document.createElement('select');
  roomSelect.className = 'room-select';
  const uniqueRooms = [...new Set(inventoryList.map(i => i.room))];
  uniqueRooms.forEach(room => {
    const option = document.createElement('option');
    option.value = room;
    option.textContent = room;
    roomSelect.appendChild(option);
  });
  roomCell.appendChild(roomSelect);

  // Item cell with Tom Select
  const itemCell = document.createElement('td');
  const itemSelect = document.createElement('select');
  itemSelect.className = 'item-select';

  inventoryList.forEach(item => {
    const option = document.createElement('option');
    option.value = item.value;
    option.text = item.text;
    itemSelect.appendChild(option);
  });

  itemCell.appendChild(itemSelect);

  // Quantity cell
  const qtyCell = document.createElement('td');
  const qtyInput = document.createElement('input');
  qtyInput.type = 'number';
  qtyInput.value = 1;
  qtyInput.min = 1;
  qtyCell.appendChild(qtyInput);

  // Weight and Cuft display cells
  const weightCell = document.createElement('td');
  const cuftCell = document.createElement('td');

  // Remove button cell
  const removeCell = document.createElement('td');
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.className = 'btn';
  removeBtn.onclick = () => {
    tr.remove();
    updateSummary();
  };
  removeCell.appendChild(removeBtn);

  // Add row to table
  tr.appendChild(roomCell);
  tr.appendChild(itemCell);
  tr.appendChild(qtyCell);
  tr.appendChild(weightCell);
  tr.appendChild(cuftCell);
  tr.appendChild(removeCell);
  tbody.appendChild(tr);

  // Initialize TomSelect AFTER appending to DOM
  setTimeout(() => {
    new TomSelect(itemSelect, {
      maxOptions: 500,
      searchField: 'text',
      valueField: 'value',
      labelField: 'text',
      sortField: { field: 'text', direction: 'asc' },
      placeholder: 'Search for an item...'
    });
  });

  [itemSelect, qtyInput].forEach(el => el.addEventListener('change', updateSummary));
  updateSummary();
}

function updateSummary() {
  let totalWeight = 0;
  let totalCuft = 0;

  document.querySelectorAll('#inventoryBody tr').forEach(tr => {
    const itemValue = tr.children[1].querySelector('select')?.value;
    const quantity = parseInt(tr.children[2].querySelector('input')?.value) || 0;
    const item = inventoryList.find(i => i.value === itemValue);

    if (!item) {
      tr.children[3].textContent = 0;
      tr.children[4].textContent = 0;
      return;
    }

    const weight = item.weight * quantity;
    const cuft = item.cuft * quantity;
    tr.children[3].textContent = weight;
    tr.children[4].textContent = cuft;
    totalWeight += weight;
    totalCuft += cuft;
  })
}