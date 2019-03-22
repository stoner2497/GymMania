const transporter = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          auth: {
            xoauth2: xoauth2.createXOAuth2Generator({
              user: "sahilshah22269@gmail.com",
              clientId:
                "870725568586-mlulucu27lksoef40h2pq7u08kk6jk7j.apps.googleusercontent.com",
              clientSecret: "dn2j9FXeHolPamji2ODnUTkq",
              refreshToken: "1/GqGWmcwDxu3q1Sn-TnZPHEcecPpi4FGrYxO4VpMpqzg"
            })
          }
        })
      );
      const mailOptions = {
        from: "gymmania <sahilshah22269@gmail.com>",
        to: admin.email,
        subject: "gymmania",
        text: "hello world"
      };

      transporter.sendMail(mailOptions, (err, res) => {
        if (err) throw err;
        console.log(`email sent ${res}`);
      });
      res.render("admin/index");
    