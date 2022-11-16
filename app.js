const getVenuePoint = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const latitude = urlParams.get("latitude");
  const longitude = urlParams.get("longitude");

  return [latitude || 0, longitude || 0];
};

const delay = async (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const getCurrentTemp = async (latitude, longitude) => {
  console.time("getCurrentTemp");
  // in the real world, you'd call out to a data provider to fetch the weather
  // at the display venue's point. for this example, we're artificially waiting
  await delay(250);
  console.timeEnd("getCurrentTemp");
  return "34°";
};

const initCreative = async () => {
  const [latitude, longitude] = getVenuePoint();
  console.log("lat/lng:", latitude, longitude);

  const currentTemp = await getCurrentTemp(latitude, longitude);
  console.log("currentTemp:", currentTemp);

  document.getElementById("temp").innerText = currentTemp;
  console.log("signaling ready!");

  const ready = document.createElement("div");
  ready.id = "dynamic-creative-ready";
  document.body.appendChild(ready);
};

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    initCreative();
  }
};
