import express from "express";
import cors from "cors";
import pino from "pino";
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let sock = null;
let connectionStatus = "starting";

async function startWhatsApp() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./auth_info");

  sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      connectionStatus = "connected";
      console.log("WhatsApp connected");
    }

    if (connection === "connecting") {
      connectionStatus = "connecting";
    }

    if (connection === "close") {
      connectionStatus = "disconnected";

      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("Reconnecting WhatsApp...");
        setTimeout(startWhatsApp, 3000);
      }
    }
  });
}

app.get("/", (req, res) => {
  res.json({
    status: "DevArth-Bot Backend Online",
    whatsapp: connectionStatus
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    status: connectionStatus
  });
});

app.post("/api/pairing", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required"
      });
    }

    if (!sock) {
      return res.status(503).json({
        success: false,
        error: "WhatsApp is not ready"
      });
    }

    const number = String(phoneNumber).replace(/\D/g, "");

    if (number.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Invalid phone number"
      });
    }

    const pairingCode = await sock.requestPairingCode(number);

    return res.json({
      success: true,
      pairingCode
    });

  } catch (error) {
    console.error("Pairing error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to generate pairing code"
    });
  }
});

app.listen(PORT, async () => {
  console.log(`DevArth-Bot Backend running on port ${PORT}`);

  console.log("Starting WhatsApp/Baileys...");

  try {
    await startWhatsApp();
    console.log("WhatsApp start function executed");
  } catch (error) {
    console.error("WhatsApp startup error:", error);
    console.error(error.stack);
  }
});