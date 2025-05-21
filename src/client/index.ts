async function main() {
  console.log("Starting Peril client...");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
