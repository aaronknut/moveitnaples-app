async function saveCurrentProject() {
  const db = window.firebaseDB;
  const name = document.getElementById('projectName').value;
  const origin = document.getElementById('originAddress').value;
  const destination = document.getElementById('destinationAddress').value;
  const totalWeight = document.getElementById('totalWeight').textContent;
  const totalCuft = document.getElementById('totalCuft').textContent;

  if (!name) {
    alert("Please enter a project name.");
    return;
  }

  try {
    await addDoc(collection(db, "projects"), {
      name,
      origin,
      destination,
      totalWeight,
      totalCuft,
      timestamp: new Date()
    });
    alert("Project saved!");
    loadSavedProjects(); // refresh list
  } catch (e) {
    console.error("Error saving project:", e);
  }
}

async function loadSavedProjects() {
  const db = window.firebaseDB;
  const projectList = document.getElementById('projectList');
  projectList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "projects"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement('li');
    li.textContent = `${data.name} – ${data.origin} → ${data.destination} (${data.totalWeight} lbs, ${data.totalCuft} cuft)`;
    projectList.appendChild(li);
  });
}

// Automatically load saved projects on page load
window.addEventListener('DOMContentLoaded', loadSavedProjects);