/* eslint-disable */
import JsPDF from 'jspdf'
export default{
  install (Vue, options) {
    Vue.prototype.generatePdf = function (bkground) {
      let getImageFromUrl = function (callback) {
        let img = new Image()
        img.onError = function () {
          alert('Cannot load image')
        }
        img.onload = function () {
          callback(bkground)
        }
        img.src = '../../static/certificate.jpg'
        callback(img)
      }
      let createPDF = function (imgData) {
        console.log('in createPDF')
        let doc = new JsPDF()
        doc.addImage(imgData, 'JPG', 25, 25, 170, 250, 'monkey')
        doc.addFont('simhei-normal.ttf', 'simhei', 'normal')
        doc.setFont('simhei')
        doc.text('David Xiang', 110, 120)
        doc.text('Boya', 105, 162)
        doc.text('2019/06/20 8:30', 105, 176)
        doc.text('0 h 30 min', 105, 190)
        doc.text('010101', 105, 205)
        doc.save('certificate.pdf')
      }
      getImageFromUrl(createPDF)
    }
  }
}
