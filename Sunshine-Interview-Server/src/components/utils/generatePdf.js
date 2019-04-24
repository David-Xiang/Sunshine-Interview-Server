/* eslint-disable */
import JsPDF from 'jspdf'
import html2Canvas from 'html2canvas'

export default{
  install (Vue, options) {
    Vue.prototype.generatePdf = function () {
      html2Canvas(document.getElementById('certificate'), {
        onrendered: function(canvas) {
          document.body.appendChild(canvas);
        },
      }).then(function (canvas) {
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let doc = new JsPDF('a4')
        doc.addImage(pageData, 'JPEG', 20, 15, 180, 250)
        doc.save('certificate.pdf')
      });
    }
  }
}
