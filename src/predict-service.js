const tf = require("@tensorflow/tfjs");
const path = require("path");
const metadata = require("../model/metadata.json");

class PredictService {
  async predictImage(photo) {
    // membuat path ke file model tensorflow.js
    const modelPath = `file://${path.resolve(__dirname, "..", "model.json")}`;
    // Memuat model dari file model.json
    const model = await tf.loadLayersModel(modelPath);

    // proses input gambar
    // 1. decode file gambar
    // 2. Ubah ukurannya menjadi [224, 224] pixel
    // 3. Tambahkan dimensi batch (convert ke bentuk tensor [1, 224, 224, 3])
    // 4. Konversi ke tipe float
    const tensor = tf.node.decodeImage(photo).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

    //   melakukan prediksi menggunakan model
    const predict = await model.predict(tensor);
    const score = await predict.data();
    // mengembalikan confidence score tertinggi
    const confidenceScore = Math.max(...score);
    // mengambil label penyakit berdasarkan indeks prediksi
    const label = tf.argMax(predict, 1).dataSync()[0];
    const diseaseLabels = metadata.labels;
    const diseaseLabel = diseaseLabels[label];

    return { confidenceScore, diseaseLabel };
  }
}

module.exports = PredictService;
