
export default function EventCard({event}) {
return (
<div style={{
background:'white',
padding:'20px',
borderRadius:'12px',
marginBottom:'20px'
}}>
<h2>{event.title}</h2>
<p>{event.description}</p>
<p><strong>Location:</strong> {event.location}</p>
</div>
)
}
