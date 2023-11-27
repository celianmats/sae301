<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class DefaultController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    #[Route('/default', name: 'app_default')]
    public function index(Request $request): Response
    {
        // Vérifie si l'utilisateur est connecté
        $user = $this->security->getUser();

        return $this->render('default/index.html.twig', [
            'controller_name' => 'DefaultController',
            'user' => $user,
        ]);
    }
}


