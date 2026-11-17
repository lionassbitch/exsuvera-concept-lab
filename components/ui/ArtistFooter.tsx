import { artist } from "../../lib/artist-config";

export function ArtistFooter() {
  return (
    <footer className="rd-footer">
      <p className="rd-kicker">Artist information</p>
      <h2 id="rd-contact-title">Contact</h2>
      <p className="rd-note">
        {artist.bio ?? "Biography has not been published on this site."}
      </p>
      <div className="rd-facts">
        <section>
          <h3>Shows</h3>
          {artist.shows.length === 0 ? (
            <p>No shows are listed.</p>
          ) : (
            <ul>
              {artist.shows.map((show) => (
                <li key={`${show.date}-${show.place}`}>
                  {show.href ? <a href={show.href}>{show.date} — {show.place}</a> : `${show.date} — ${show.place}`}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h3>Contact</h3>
          {artist.bookingEmail ? (
            <p>
              <a href={`mailto:${artist.bookingEmail}`}>Booking {artist.bookingEmail}</a>
            </p>
          ) : (
            <p>Booking email is not configured.</p>
          )}
          {artist.contactDestinations.length === 0 ? (
            <p>No other contact destination is configured.</p>
          ) : (
            <ul>
              {artist.contactDestinations.map((destination) => (
                <li key={destination.href}>
                  <a href={destination.href}>{destination.label}</a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </footer>
  );
}
