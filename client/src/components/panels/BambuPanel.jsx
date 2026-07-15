import useLiveReadings from "../../hooks/useLiveReadings";
import MetricCard from "../shared/MetricCard";
import './BambuPanel.css';

export default function BambuPanel() {
    const { readings } = useLiveReadings();
    
    return (
        <div>
            <MetricCard 
                metric="nozzle_temp"
                value={readings.nozzle_temp?.value}
                unit="°F"
            />
            <MetricCard 
                metric="bed_temp"
                value={readings.bed_temp?.value}
                unit="°F"
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
        </div>
    )
}