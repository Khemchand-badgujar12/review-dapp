if (typeof window.ethereum === "undefined") {
  alert("MetaMask not detected! Please install MetaMask.");
}


const contractAddress = "0xBF2f7C731a78d61FC0d44aA81D7cA8c63ABbAf4D";

const abi = [
  {
    "inputs":[
      {"internalType":"string","name":"_productId","type":"string"},
      {"internalType":"uint256","name":"_rating","type":"uint256"},
      {"internalType":"string","name":"_text","type":"string"}
    ],
    "name":"addReview",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"getReviews",
    "outputs":[
      {
        "components":[
          {"internalType":"address","name":"user","type":"address"},
          {"internalType":"string","name":"productId","type":"string"},
          {"internalType":"uint256","name":"rating","type":"uint256"},
          {"internalType":"string","name":"text","type":"string"}
        ],
        "internalType":"struct ReviewSystem.Review[]",
        "name":"",
        "type":"tuple[]"
      }
    ],
    "stateMutability":"view",
    "type":"function"
  }
];

let provider, signer, contract;

document.getElementById("connectBtn").onclick = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  try {
    const providerMM = new ethers.providers.Web3Provider(window.ethereum, "any");

    await providerMM.send("eth_requestAccounts", []);

    signer = providerMM.getSigner();
    provider = providerMM;

    const address = await signer.getAddress();

    contract = new ethers.Contract(contractAddress, abi, signer);

    document.getElementById("wallet").innerText = "Connected: " + address;

    loadReviews();
  } catch (err) {
    console.error(err);
    alert("User rejected or MetaMask blocked connection");
  }
};



document.getElementById("submitBtn").onclick = async () => {
  const p = productId.value;
  const r = rating.value;
  const t = review.value;

  const tx = await contract.addReview(p, r, t);
  await tx.wait();

  alert("Review stored on blockchain!");
  loadReviews();
};

async function loadReviews() {
  const list = await contract.getReviews();
  reviews.innerHTML = "";

  list.forEach(r => {
    reviews.innerHTML += `
      <p>
      🧑 ${r.user}<br>
      📦 ${r.productId}<br>
      ⭐ ${r.rating}<br>
      💬 ${r.text}
      </p><hr>`;
  });
}
