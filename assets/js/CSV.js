export default class CSV {
    constructor(tablePhase, tableResultByPhase, tableResultTotal) {
        this.tablePhase = tablePhase
        this.tableResultByPhase = tableResultByPhase
        this.tableResultTotal = tableResultTotal
    }

    exportFile() {

    }

    triggerDownload(url, filename) {
        const downloadLink = document.createElement('a')
        downloadLink.href = url
        downloadLink.download = filename
        document.body.appendChild(downloadLink)
        downloadLink.click()
    }
}