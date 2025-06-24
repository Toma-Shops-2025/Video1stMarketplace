import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const paymentIntent = params.get('payment_intent');
  const redirectStatus = params.get('redirect_status');

  useEffect(() => {
    localStorage.removeItem('cart');
    if (redirectStatus !== 'succeeded') {
      navigate('/cart');
    }
  }, [redirectStatus, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h1>🎉 Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
      <p>Your order is being processed.</p>
      {paymentIntent && (
        <p>
          <strong>Payment Reference:</strong> {paymentIntent}
        </p>
      )}
      <a href="/">Return to Home</a>
    </div>
  );
};

export default PaymentSuccess; 