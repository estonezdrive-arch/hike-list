import wixData from 'wix-data';

function wixImageToHttpUrl(wixImage) {
  if (!wixImage) return "";

  // Sometimes Wix returns an object like { src: "wix:image://..." }
  const src = typeof wixImage === "string" ? wixImage : (wixImage.src || "");

  if (!src) return "";
  if (src.startsWith("http")) return src;

  // Typical format:
  // wix:image://v1/<fileName>/<originalFileName>#originWidth=..&originHeight=..
  // We want <fileName>
  const m = src.match(/^wix:image:\/\/v1\/([^/]+)\//);
  if (m && m[1]) {
    return `https://static.wixstatic.com/media/${m[1]}`;
  }

  // Fallback if the string is slightly different
  const m2 = src.match(/^wix:image:\/\/v1\/([^#]+)#?/);
  if (m2 && m2[1]) {
    const fileName = m2[1].split("/")[0];
    return `https://static.wixstatic.com/media/${fileName}`;
  }

  return "";
}

$w.onReady(async function () {
  const res = await wixData.query("Items").limit(3).find();

  const items = res.items.map((x) => ({
    title: x.title,
    imageUrl: wixImageToHttpUrl(x.topoMap),
    difficulty: x.difficulty,
    distance: x.distance,
    duration: x.duration,
    link: x.link || "#"
  }));

  // Helpful debug: confirm you're sending https URLs
  console.log("Mapped items:", items);

  $w("#hikeCards").postMessage({
    type: "HIKES_DATA",
    items
  });
});
