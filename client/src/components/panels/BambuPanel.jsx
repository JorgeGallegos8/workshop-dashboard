import './BambuPanel.css';
import useLiveReadings from "../../hooks/useLiveReadings";
import MetricCard from "../shared/MetricCard";

export default function BambuPanel() {
    const { readings } = useLiveReadings();
    
    if (!readings.nozzle_temp) {
        return (
            <article className="bambu-panel bambu-panel--loading" aria-busy="true">
                Connecting to printer...
            </article>
        );
    }

    const isIdle = !readings.print_percentage?.value || readings.print_percentage?.value === 0;

    if (isIdle) {
        return (
            <article className="bambu-panel bambu-panel--idle">
                <h2 className="bambu-panel__title">Bambu Printer</h2>
                <p className="bambu-panel__status">Idle</p>
            </article>
        );
    }

    return (
        <article className="bambu-panel">
            <MetricCard 
                metric="nozzle_temp"
                value={readings.nozzle_temp?.value}
                unit="°C"
                decimals={0}
            />
            <MetricCard 
                metric="bed_temp"
                value={readings.bed_temp?.value}
                unit="°C"
                decimals={0}
            />
            <MetricCard 
                metric="print_percentage"
                value={readings.print_percentage?.value}
                unit="%"
            />
            <div className="bambu-panel__progress">
                <div 
                    className="bambu-panel__progress-bar"
                    style={{ width: `${readings.print_percentage?.value || 0}%`}}
                />
            </div>
        </article>
    )
}