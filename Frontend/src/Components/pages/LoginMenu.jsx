import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import LoginMenuImage  from "../../assets/images/LoginMenuImage.jpg"
const Menu = [
  {
    title: "Samvad Admin Login",
    subtitle: "छत्तीसगढ़ संवाद के कार्यालन लॉग इन",
    iconClass: "bi-person",
    href: "/admin-login",
  },
  {
    title: "Newspaper Login",
    subtitle: "दैनिक समाचार पत्र लॉग इन",
    iconClass: "bi-files",
    href: "/newspaper-login",
  },
  {
    title: "Edition Login",
    subtitle:
      "पत्रिका - स्मारिका लॉग इन (पाक्षिक्, दैनिक, साप्ताहिक, द्वैमासिक, मासिक, त्रैमासिक, छमाही, वार्षिक, वेबसाइट, वेब पोर्टल)",
    iconClass: "bi-journal-bookmark",
    href: "/edition-login",
  },
  {
    title: "Office Login",
    subtitle:
      "संवाद से पंजीकृत कार्यालय जिन्हें विज्ञापन/होर्डिंग्स प्रकाशित करना है, यहाँ लॉग इन करे",
    iconClass: "bi-people",
    href: "/office-login",
  },
  {
    title: "District P.R.O. Login",
    subtitle: "जिला जनसंपर्क कार्यालय प्रतिनिधि लॉग इन",
    iconClass: "bi-geo-alt",
    href: "/district-pro-login",
  },
  {
    title: "Hoarding Agency Login",
    subtitle: "होर्डिंग लगाने हेतु संवाद से पंजीकृत संस्था लॉग इन",
    iconClass: "bi-display",
    href: "/hoarding-agency-login",
  },
  {
    title: "E-Tender Login",
    subtitle: "संवाद द्वारा जारी E-Tender लॉग इन",
    iconClass: "bi-file-earmark-text",
    href: "/e-tender-login",
  },
  {
    title: "Electronic Media Login",
    subtitle:
      "टीवी चैनल्स, ब्रॉडकास्ट, प्रोडक्शन हाउस, एयरपोर्ट, रेलवे स्टेशन, पीवीआर/आईनोक्स/यूएफओ",
    iconClass: "bi-globe",
    href: "/electronic-media-login",
  },
  {
    title: "Printer Login",
    subtitle: "प्रिंटर हेतु संवाद से पंजीकृत संस्था लॉग इन",
    iconClass: "bi-printer",
    href: "/printer-login",
  },
];

const LoginMenu = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Image Column */}
        <div className="col-md-6 p-0">
          <img
            src={LoginMenuImage ? LoginMenuImage :'https://picsum.photos/id/1/200/300'}
            // src={'https://fastly.picsum.photos/id/8/5000/3333.jpg?hmac=OeG5ufhPYQBd6Rx1TAldAuF92lhCzAhKQKttGfawWuA'}
            alt="Login Menu"
            className="img-fluid w-100"
          />
        </div>

        {/* Right Menu Column */}
        <div className="col-md-6">
          <Container className="py-5">
            <h2 className="text-center">Login</h2>
            <hr
              style={{
                width: "4rem",
                borderTop: "3px solid #20c997",
                margin: "0.5rem auto 2rem",
              }}
            />

            <Row xs={2} md={3} className="g-4">
              {Menu.map((opt) => (
                <Col key={opt.title} className="d-flex justify-content-center">
                  <Card
                    className="text-center border-0"
                    style={{ maxWidth: 320 }}
                  >
                    <Card.Body>
                      <i
                        className={`${opt.iconClass} text-success mb-2`}
                        style={{ fontSize: "2rem", lineHeight: 1 }}
                      />
                      <Card.Title className="mt-2">
                        <a
                          href={opt.href}
                          className="text-decoration-none text-success"
                        >
                          {opt.title}
                        </a>
                      </Card.Title>
                      <Card.Text className="text-muted small">
                        {opt.subtitle}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default LoginMenu;
