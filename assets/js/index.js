import {
    handleNewPhase,
    handleChangePhaseNumber,
    handleClearPhase,
    handleStartCalculate,
    handleClearResult,
    handleInputTotalChange,
    handleInputCorrectedChange
} from './handle-event.js'
import {
    phaseNumberInput,
    phaseNumberSubmitButton,
    phaseNumberClearButton,
    calculateButton,
    time,
    resultClearButton
} from './constants.js'

(() => {
    phaseNumberInput.addEventListener('change', handleChangePhaseNumber)
    phaseNumberSubmitButton.addEventListener('click', handleNewPhase)
    phaseNumberClearButton.addEventListener('click', handleClearPhase)
    calculateButton.addEventListener('click', handleStartCalculate)
    resultClearButton.addEventListener('click', handleClearResult)

    setInterval(() => {
        const date = new Date()
        time.innerText = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours() > 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()}:${date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds()}`
    }, 1000)
})()

const refreshPhaseNumberTable = () => {
    const phaseNumberRows = document.querySelectorAll('#middle table .phase-number-row')
    if (phaseNumberRows) {
        phaseNumberRows.forEach(row => {
            const columnName = row.children[0]
            const columnCorrected = row.children[1]
            const columnTotal = row.children[2]
            columnCorrected.children[0].addEventListener('change', (event) => handleInputCorrectedChange(event.target, columnName.children[0], columnTotal.children[0]))
            columnTotal.children[0].addEventListener('change', (event) => handleInputTotalChange(event.target, columnCorrected.children[0]))
        })
    }
}

export {refreshPhaseNumberTable}