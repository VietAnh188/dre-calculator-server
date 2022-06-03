export default class CSV {
    constructor(tablePhase, tableResultByPhase, tableResultTotal) {
        this.tablePhase = tablePhase
        this.tableResultByPhase = tableResultByPhase
        this.tableResultTotal = tableResultTotal
    }

    exportFile() {
        let content = []
        const tablePhaseHeaderRow = this.tablePhase.querySelector('tr.header')
        content.push([...tablePhaseHeaderRow.children].map(th => th.querySelector('p').innerText))
        const tablePhaseDataRows = this.tablePhase.querySelectorAll('tr:not(.header)')
        tablePhaseDataRows.forEach(tr => {
            content.push([...tr.children].map(td => td.querySelector('input').value))
        })
        const tableResultByPhaseHeaderRow = this.tableResultByPhase.querySelector('tr.header')
        content.push([...tableResultByPhaseHeaderRow.children].map(th => th.querySelector('p').innerText))
        const tableResultByPhaseDataRows = this.tableResultByPhase.querySelectorAll('tr:not(.header)')
        tableResultByPhaseDataRows.forEach(tr => {
            content.push([...tr.children].map(td => td.innerText))
        })
        const tableResultTotalHeaderRow = this.tableResultTotal.querySelector('tr.header')
        content.push([...tableResultTotalHeaderRow.children].map(th => th.querySelector('p').innerText))
        const tableResultTotalDataRow = this.tableResultTotal.querySelector('tr:not(.header)')
        content.push([...tableResultTotalDataRow.children].map(th => th.innerText))
        content = content.map(item => item.join(',')).join('\n')
        const contentUrl = 'data:text/csv;charter=utf-8,' + content
        this.triggerDownload(contentUrl, 'result.csv')
    }

    triggerDownload(url, filename) {
        const downloadLink = document.createElement('a')
        downloadLink.href = url
        downloadLink.download = filename
        document.body.appendChild(downloadLink)
        downloadLink.click()
    }
}